'use client';

import * as React from 'react';
import {
  Search,
  Star,
  CheckCircle,
  BookOpen,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Filter,
  X,
  ArrowLeft,
} from 'lucide-react';
import { OXFORD_DATASET, ALPHABET_LETTERS, CEFR_COUNTS } from '@/data/oxfordDataset';
import { LexiconItem, CefrLevel } from '../types';
import { useStore } from '@/lib/store';
import { AudioPlayButton } from '@/features/audio-speech/components/AudioPlayButton';
import { WordPracticeDialog } from '@/features/vocabulary-practice/components/word-practice-dialog';
import { matchesSearchQuery, extractArabicMeanings } from '@/lib/arabic-search';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { OPEN_WORD_EVENT, PENDING_WORD_KEY } from '@/components/shared/CommandPalette';

export function LexiconCatalog() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCefr, setSelectedCefr] = React.useState<CefrLevel>('ALL');
  const [selectedLetter, setSelectedLetter] = React.useState<string>('ALL');
  const [filterFavorites, setFilterFavorites] = React.useState(false);
  const [filterMastered, setFilterMastered] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const itemsPerPage = 24;

  // Selected word for All-in-One Interactive Practice Dialog
  const [selectedPracticeWord, setSelectedPracticeWord] = React.useState<LexiconItem | null>(null);

  // Zustand state
  const masteredWordIds = useStore((state) => state.masteredWordIds);
  const favoriteWordIds = useStore((state) => state.favoriteWordIds);
  const toggleMastered = useStore((state) => state.toggleMastered);
  const toggleFavorite = useStore((state) => state.toggleFavorite);
  const recordWordView = useStore((state) => state.recordWordView);
  const recordSearch = useStore((state) => state.recordSearch);

  // Filtered dataset with Diacritic-Agnostic Deep Arabic Search
  const filteredData = React.useMemo(() => {
    return OXFORD_DATASET.filter((item) => {
      // Diacritic-agnostic deep search query matching
      if (searchQuery.trim()) {
        if (!matchesSearchQuery(item, searchQuery)) {
          return false;
        }
      }

      // CEFR level
      if (selectedCefr !== 'ALL' && item.cefr !== selectedCefr) {
        return false;
      }

      // Letter filter
      if (selectedLetter !== 'ALL') {
        const firstLetter = item.word.charAt(0).toUpperCase();
        if (firstLetter !== selectedLetter) return false;
      }

      // Favorites only
      if (filterFavorites && !favoriteWordIds.includes(item.id)) {
        return false;
      }

      // Mastered only
      if (filterMastered && !masteredWordIds.includes(item.id)) {
        return false;
      }

      return true;
    });
  }, [
    searchQuery,
    selectedCefr,
    selectedLetter,
    filterFavorites,
    filterMastered,
    favoriteWordIds,
    masteredWordIds,
  ]);

  // Pagination slice
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedItems = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCefr, selectedLetter, filterFavorites, filterMastered]);

  /* ---------------- Deep-link / command-palette word opening ---------------- */
  const openWordById = React.useCallback(
    (id: number) => {
      const item = OXFORD_DATASET.find((entry) => entry.id === id);
      if (!item) return;
      setSelectedPracticeWord(item);
      recordWordView(id);
    },
    [recordWordView]
  );

  React.useEffect(() => {
    try {
      const pending = sessionStorage.getItem(PENDING_WORD_KEY);
      if (pending) {
        sessionStorage.removeItem(PENDING_WORD_KEY);
        openWordById(Number(pending));
      }
    } catch {
      /* storage unavailable */
    }

    const handler = (event: Event) => {
      const detail = (event as CustomEvent<number>).detail;
      if (typeof detail === 'number') openWordById(detail);
    };
    window.addEventListener(OPEN_WORD_EVENT, handler);
    return () => window.removeEventListener(OPEN_WORD_EVENT, handler);
  }, [openWordById]);

  /* ---------------- Persist meaningful searches (for the paletted) -------- */
  React.useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 3) return;
    const timer = window.setTimeout(() => recordSearch(query), 1400);
    return () => window.clearTimeout(timer);
  }, [searchQuery, recordSearch]);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    selectedCefr !== 'ALL' ||
    selectedLetter !== 'ALL' ||
    filterFavorites ||
    filterMastered;

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCefr('ALL');
    setSelectedLetter('ALL');
    setFilterFavorites(false);
    setFilterMastered(false);
  };

  // Compact pager window
  const pageNumbers = React.useMemo(() => {
    const windowSize = 5;
    let start = Math.max(1, currentPage - Math.floor(windowSize / 2));
    const end = Math.min(totalPages, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);
    const pages: number[] = [];
    for (let page = start; page <= end; page += 1) pages.push(page);
    return pages;
  }, [currentPage, totalPages]);

  const renderCard = (item: LexiconItem) => {
    const isMastered = masteredWordIds.includes(item.id);
    const isFavorite = favoriteWordIds.includes(item.id);
    const meanings = extractArabicMeanings(item.arabic);

    return (
      <div
        key={item.id}
        role="button"
        tabIndex={0}
        onClick={() => {
          setSelectedPracticeWord(item);
          recordWordView(item.id);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setSelectedPracticeWord(item);
            recordWordView(item.id);
          }
        }}
        className={cn(
          'archetype-card group relative space-y-2.5 cursor-pointer select-none bg-surface p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isMastered && 'border-emerald-600/30'
        )}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between" onClick={(event) => event.stopPropagation()}>
          <div className="flex items-center gap-2">
            <span className="ltr-isolate text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
              {item.cefr}
            </span>
            <span className="h-2.5 w-px bg-border" aria-hidden="true" />
            <span className="ltr-isolate text-[10.5px] font-medium lowercase text-muted-foreground">{item.pos}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleFavorite(item.id)}
              className={cn(
                'rounded-full p-1.5 text-muted-foreground transition-all hover:bg-muted active:scale-90',
                isFavorite && 'text-amber-500 hover:text-amber-600'
              )}
              title={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
              aria-pressed={isFavorite}
            >
              <Star className={cn('h-4 w-4', isFavorite && 'fill-current')} />
            </button>
            <button
              onClick={() => toggleMastered(item.id)}
              className={cn(
                'rounded-full p-1.5 text-muted-foreground transition-all hover:bg-muted active:scale-90',
                isMastered && 'text-emerald-500 hover:text-emerald-600'
              )}
              title={isMastered ? 'إزالة الإتقان' : 'تحديد كمتقنة (+25 XP)'}
              aria-pressed={isMastered}
            >
              <CheckCircle className={cn('h-4 w-4', isMastered && 'fill-emerald-500/20')} />
            </button>
          </div>
        </div>

        {/* Word & IPA */}
        <div>
          <h3 className="ltr-isolate font-heading text-[1.35rem] font-semibold leading-none tracking-[-0.01em] text-foreground transition-colors group-hover:text-primary">
            {item.word}
          </h3>
          <p className="ltr-isolate mt-1.5 font-mono text-[10.5px] text-muted-foreground">{item.ipa}</p>
        </div>

        {/* Meanings */}
        <p className="line-clamp-1 text-[12.5px] leading-relaxed text-foreground">
          {meanings.slice(0, 2).join('، ')}
          {meanings.length > 2 && (
            <span className="ms-1 text-[10.5px] font-medium text-muted-foreground">
              +{meanings.length - 2}
            </span>
          )}
        </p>

        {/* Example Sentence */}
        <p
          dir="ltr"
          className="line-clamp-2 border-t border-border pt-2.5 text-left text-[11px] italic leading-[1.7] text-muted-foreground"
        >
          “{item.example}”
        </p>

        {/* Quick Action Footer */}
        <div
          className="flex items-center justify-between gap-2 pt-0.5"
          onClick={(event) => event.stopPropagation()}
        >
          <AudioPlayButton text={item.word} size="sm" variant="ghost" label="نطق" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedPracticeWord(item);
              recordWordView(item.id);
            }}
            className="archetype-btn gap-1 border-transparent px-1.5 text-[11px] font-semibold text-primary hover:bg-primary/5"
          >
            تدريب شامل
            <ArrowLeft className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  };

  const renderRow = (item: LexiconItem) => {
    const isMastered = masteredWordIds.includes(item.id);
    const isFavorite = favoriteWordIds.includes(item.id);
    const meanings = extractArabicMeanings(item.arabic);

    return (
      <div
        key={item.id}
        role="button"
        tabIndex={0}
        onClick={() => {
          setSelectedPracticeWord(item);
          recordWordView(item.id);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            setSelectedPracticeWord(item);
            recordWordView(item.id);
          }
        }}
        className={cn(
          'archetype-card group grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-3 bg-surface px-3.5 py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-[auto_minmax(7rem,1fr)_minmax(0,1.4fr)_auto]',
          isMastered && 'border-emerald-500/40'
        )}
      >
        <Badge
          variant={item.cefr === 'A1' ? 'a1' : item.cefr === 'A2' ? 'a2' : item.cefr === 'B1' ? 'b1' : 'b2'}
          className="archetype-badge shrink-0 text-[10px]"
        >
          {item.cefr}
        </Badge>

        <div className="min-w-0">
          <p className="truncate font-heading text-sm font-black leading-tight transition-colors group-hover:text-primary ltr-isolate">
            {item.word}
          </p>
          <p className="truncate font-mono text-[10px] text-muted-foreground ltr-isolate">
            {item.ipa}
          </p>
        </div>

        <p className="hidden min-w-0 truncate text-xs text-muted-foreground rtl-text sm:block">
          {meanings[0]} <span className="opacity-60">· {item.pos}</span>
        </p>

        <div className="flex shrink-0 items-center gap-0.5" onClick={(event) => event.stopPropagation()}>
          <button
            onClick={() => toggleFavorite(item.id)}
            className={cn(
              'rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted',
              isFavorite && 'text-amber-500'
            )}
            title="المفضلة"
            aria-pressed={isFavorite}
          >
            <Star className={cn('h-3.5 w-3.5', isFavorite && 'fill-current')} />
          </button>
          <button
            onClick={() => toggleMastered(item.id)}
            className={cn(
              'rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted',
              isMastered && 'text-emerald-500'
            )}
            title="الإتقان"
            aria-pressed={isMastered}
          >
            <CheckCircle className={cn('h-3.5 w-3.5', isMastered && 'fill-emerald-500/20')} />
          </button>
          <AudioPlayButton text={item.word} size="sm" variant="ghost" />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Search & Filter Controls */}
      <div className="space-y-4 rounded-md border border-border bg-surface p-4 sm:p-5">
        <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="ابحث بالعربية (مع/بدون تشكيل) أو بالإنجليزية..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="bg-background/50 pl-9 pr-9 text-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="مسح البحث"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex w-full flex-wrap items-center justify-end gap-2 md:w-auto">
            <Button
              variant={filterFavorites ? 'accent' : 'outline'}
              size="sm"
              onClick={() => setFilterFavorites(!filterFavorites)}
              className="archetype-btn gap-1.5 text-xs"
            >
              <Star className={cn('h-3.5 w-3.5', filterFavorites && 'fill-current')} />
              المفضلة ({favoriteWordIds.length})
            </Button>
            <Button
              variant={filterMastered ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterMastered(!filterMastered)}
              className="archetype-btn gap-1.5 text-xs"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              المتقنة ({masteredWordIds.length})
            </Button>
            <div className="flex items-center rounded-md border border-border p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-label="عرض شبكي"
                aria-pressed={viewMode === 'grid'}
                className={cn(
                  'rounded-md p-1.5 transition-colors',
                  viewMode === 'grid'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                aria-label="عرض قائمة"
                aria-pressed={viewMode === 'list'}
                className={cn(
                  'rounded-md p-1.5 transition-colors',
                  viewMode === 'list'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="archetype-btn gap-1.5 text-xs text-muted-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                تصفير
              </Button>
            )}
          </div>
        </div>

        {/* CEFR Level Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 border-t border-border/50 pt-2">
          <span className="me-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <Filter className="h-3 w-3" aria-hidden="true" />
            المستوى
          </span>
          {(['ALL', 'A1', 'A2', 'B1', 'B2'] as const).map((lvl) => {
            const count =
              lvl === 'ALL' ? CEFR_COUNTS.TOTAL : CEFR_COUNTS[lvl as keyof typeof CEFR_COUNTS];
            const isSelected = selectedCefr === lvl;
            return (
              <button
                key={lvl}
                onClick={() => setSelectedCefr(lvl)}
                aria-pressed={isSelected}
                className={cn(
                  'ltr-isolate cursor-pointer select-none rounded-sm px-2.5 py-1 text-[11px] font-semibold tabular-nums transition-colors',
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {lvl} ({count})
              </button>
            );
          })}
        </div>

        {/* Alphabet Bar */}
        <div className="flex flex-wrap items-center gap-1 overflow-x-auto pb-1 pt-1">
          <button
            onClick={() => setSelectedLetter('ALL')}
            className={cn(
              'ltr-isolate rounded-sm px-2 py-1 text-[11px] font-semibold uppercase tracking-wide transition-colors',
              selectedLetter === 'ALL'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            ALL
          </button>
          {ALPHABET_LETTERS.map((letter) => (
            <button
              key={letter}
              onClick={() => setSelectedLetter(letter)}
              aria-pressed={selectedLetter === letter}
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-sm text-[11px] font-semibold uppercase transition-colors',
                selectedLetter === letter
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11.5px] font-medium text-muted-foreground">
          <span className="font-semibold tabular-nums text-foreground">{filteredData.length}</span>{' '}
          كلمة · صفحة <span className="tabular-nums">{currentPage}</span> من{' '}
          <span className="tabular-nums">{totalPages}</span>
          <span className="mx-1.5 text-border">|</span>
          اختر أي بطاقة لفتح الاستوديو
        </p>
        <span className="chip">
          {filteredData.length === OXFORD_DATASET.length
            ? 'المعجم كامل'
            : `${Math.round((filteredData.length / OXFORD_DATASET.length) * 100)}% من المعجم`}
        </span>
      </div>

      {/* Grid / List of Words */}
      {paginatedItems.length === 0 ? (
        <div className="rounded-md border border-dashed border-border bg-surface/40 p-12 text-center">
          <BookOpen className="mx-auto mb-3 h-5 w-5 text-muted-foreground/60" aria-hidden="true" />
          <h3 className="font-heading text-base font-semibold">لا توجد كلمات مطابقة</h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            جرب البحث بصيغة أخرى؛ يدعم النظام البحث بجميع تصاريف ومترادفات المعنى العربي بدون تشكيل.
          </p>
          {hasActiveFilters && (
            <Button onClick={resetFilters} className="archetype-btn mt-4 gap-1.5 text-xs">
              <RotateCcw className="h-3.5 w-3.5" />
              إعادة ضبط المرشحات
            </Button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div
          key={`grid-${currentPage}-${selectedCefr}-${selectedLetter}-${searchQuery}`}
          className="stagger grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {paginatedItems.map(renderCard)}
        </div>
      ) : (
        <div
          key={`list-${currentPage}-${selectedCefr}-${selectedLetter}-${searchQuery}`}
          className="stagger space-y-1.5"
        >
          {paginatedItems.map(renderRow)}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(1)}
            className="archetype-btn hidden text-xs sm:inline-flex"
          >
            الأولى
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            className="archetype-btn h-8 w-8"
            aria-label="الصفحة السابقة"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              className={cn(
                'archetype-badge h-8 min-w-8 px-2 font-mono text-xs font-bold transition-all',
                page === currentPage
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {page}
            </button>
          ))}

          <Button
            variant="outline"
            size="icon"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            className="archetype-btn h-8 w-8"
            aria-label="الصفحة التالية"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(totalPages)}
            className="archetype-btn hidden text-xs sm:inline-flex"
          >
            الأخيرة
          </Button>
          <span className="px-2 font-mono text-xs font-bold text-muted-foreground">
            {currentPage}/{totalPages}
          </span>
        </div>
      )}

      {/* All-in-One Word Practice & Pronunciation Studio Dialog */}
      <WordPracticeDialog
        word={selectedPracticeWord}
        isOpen={!!selectedPracticeWord}
        onClose={() => setSelectedPracticeWord(null)}
      />
    </div>
  );
}
