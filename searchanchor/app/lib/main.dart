import 'package:flutter/material.dart';

import 'widget_catalog.dart';

/// Simulated catalog lookup so SearchAnchor can show its loading state.
const Duration kCatalogLookupDelay = Duration(milliseconds: 320);

void main() {
  runApp(const SearchAnchorStudioApp());
}

class SearchAnchorStudioApp extends StatelessWidget {
  const SearchAnchorStudioApp({super.key});

  static const Color seed = Color(0xFF2B6CEE);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SearchAnchor Studio',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: seed),
        useMaterial3: true,
      ),
      darkTheme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: seed,
          brightness: Brightness.dark,
        ),
        useMaterial3: true,
      ),
      home: const StudioPage(),
    );
  }
}

class StudioPage extends StatefulWidget {
  const StudioPage({super.key});

  @override
  State<StudioPage> createState() => _StudioPageState();
}

class _StudioPageState extends State<StudioPage> {
  late final SearchController _searchController;
  CatalogEntry? _selected;
  final List<CatalogEntry> _history = <CatalogEntry>[];
  int _suggestionGeneration = 0;
  Iterable<Widget> _lastSuggestions = const <Widget>[];

  @override
  void initState() {
    super.initState();
    _searchController = SearchController();
    _searchController.addListener(() {
      setState(() {});
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _select(CatalogEntry entry, {bool closeView = true}) {
    if (closeView && _searchController.isOpen) {
      _searchController.closeView(entry.name);
    } else {
      _searchController.text = entry.name;
    }
    setState(() {
      _selected = entry;
      _history.removeWhere((CatalogEntry item) => item.id == entry.id);
      _history.insert(0, entry);
      if (_history.length > 5) {
        _history.removeLast();
      }
    });
  }

  void _clear() {
    _searchController.clear();
    setState(() {
      _selected = null;
    });
  }

  Future<Iterable<Widget>> _suggestions(
    BuildContext context,
    SearchController controller,
  ) async {
    final int generation = ++_suggestionGeneration;
    final String query = controller.text.trim();
    final ColorScheme colors = Theme.of(context).colorScheme;

    if (query.isEmpty) {
      final List<Widget> emptyState = <Widget>[
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 20, 16, 8),
          child: Text(
            _history.isEmpty
                ? 'Start typing to search ${WidgetCatalog.size} Material widgets.'
                : 'Recent searches',
            style: Theme.of(context).textTheme.labelLarge?.copyWith(
              color: colors.onSurfaceVariant,
            ),
          ),
        ),
        if (_history.isNotEmpty)
          ..._history.map((CatalogEntry entry) => _historyTile(entry, controller)),
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
          child: Text(
            'Popular',
            style: Theme.of(context).textTheme.labelLarge?.copyWith(
              color: colors.onSurfaceVariant,
            ),
          ),
        ),
        ...WidgetCatalog.popular.map(
          (CatalogEntry entry) => _suggestionTile(entry, controller),
        ),
      ];
      _lastSuggestions = emptyState;
      return emptyState;
    }

    await Future<void>.delayed(kCatalogLookupDelay);
    if (generation != _suggestionGeneration) {
      return _lastSuggestions;
    }

    final List<CatalogEntry> matches = WidgetCatalog.search(query);
    final Iterable<Widget> built;
    if (matches.isEmpty) {
      built = <Widget>[
        ListTile(
          leading: Icon(Icons.search_off, color: colors.outline),
          title: Text('No widgets match "$query"'),
          subtitle: const Text('Try button, card, navigation, or chip.'),
        ),
      ];
    } else {
      built = matches.map((CatalogEntry entry) => _suggestionTile(entry, controller));
    }
    _lastSuggestions = built;
    return built;
  }

  Widget _historyTile(CatalogEntry entry, SearchController controller) {
    return ListTile(
      leading: const Icon(Icons.history),
      title: Text(entry.name),
      subtitle: Text(entry.category),
      trailing: IconButton(
        tooltip: 'Fill query',
        icon: const Icon(Icons.north_west),
        onPressed: () {
          controller.text = entry.name;
          controller.selection = TextSelection.collapsed(
            offset: controller.text.length,
          );
        },
      ),
      onTap: () => _select(entry),
    );
  }

  Widget _suggestionTile(CatalogEntry entry, SearchController controller) {
    return ListTile(
      leading: Icon(entry.icon),
      title: Text(entry.name),
      subtitle: Text(entry.category),
      trailing: IconButton(
        tooltip: 'Fill query',
        icon: const Icon(Icons.north_west),
        onPressed: () {
          controller.text = entry.name;
          controller.selection = TextSelection.collapsed(
            offset: controller.text.length,
          );
        },
      ),
      onTap: () => _select(entry),
    );
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final bool narrow = MediaQuery.sizeOf(context).width < 720;
    final bool canClear =
        _searchController.text.isNotEmpty || _selected != null;

    return Scaffold(
      body: SafeArea(
        child: Align(
          alignment: Alignment.topCenter,
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 880),
            child: ListView(
              padding: const EdgeInsets.fromLTRB(20, 24, 20, 40),
              children: <Widget>[
                Text(
                  'SEARCHANCHOR STUDIO',
                  style: theme.textTheme.labelLarge?.copyWith(
                    letterSpacing: 1.4,
                    color: theme.colorScheme.primary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Type-ahead over Material widgets',
                  style: theme.textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Material 3 SearchBar + SearchAnchor, searching ${WidgetCatalog.size} hardcoded widgets. Offline. No APIs.',
                  style: theme.textTheme.bodyLarge?.copyWith(
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                ),
                const SizedBox(height: 20),
                SearchAnchor.bar(
                  searchController: _searchController,
                  isFullScreen: narrow,
                  barHintText: 'Search Material widgets',
                  viewHintText: 'Search Material widgets',
                  barLeading: const Icon(Icons.search),
                  barTrailing: <Widget>[
                    if (canClear)
                      IconButton(
                        tooltip: 'Clear',
                        icon: const Icon(Icons.close),
                        onPressed: _clear,
                      ),
                  ],
                  viewTrailing: <Widget>[
                    IconButton(
                      tooltip: 'Clear',
                      icon: const Icon(Icons.close),
                      onPressed: () {
                        _searchController.clear();
                      },
                    ),
                  ],
                  suggestionsBuilder: _suggestions,
                  onSubmitted: (String value) {
                    final List<CatalogEntry> matches = WidgetCatalog.search(value);
                    if (matches.isNotEmpty) {
                      _select(matches.first);
                    }
                  },
                ),
                const SizedBox(height: 28),
                if (_selected == null) _EmptyStudio(onSelect: (CatalogEntry e) => _select(e, closeView: false)),
                if (_selected != null) _SelectedStudio(entry: _selected!, onClear: _clear),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _EmptyStudio extends StatelessWidget {
  const _EmptyStudio({required this.onSelect});

  final ValueChanged<CatalogEntry> onSelect;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Text('Popular widgets', style: theme.textTheme.titleMedium),
        const SizedBox(height: 4),
        Text(
          'Tap a chip, or open search for empty, loading, suggestions, and no-results states.',
          style: theme.textTheme.bodyMedium?.copyWith(
            color: theme.colorScheme.onSurfaceVariant,
          ),
        ),
        const SizedBox(height: 12),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: WidgetCatalog.popular.map((CatalogEntry entry) {
            return ActionChip(
              avatar: Icon(entry.icon, size: 18),
              label: Text(entry.name),
              onPressed: () => onSelect(entry),
            );
          }).toList(),
        ),
        const SizedBox(height: 28),
        Text('Catalog', style: theme.textTheme.titleMedium),
        const SizedBox(height: 8),
        ...WidgetCatalog.all.map((CatalogEntry entry) {
          return ListTile(
            contentPadding: EdgeInsets.zero,
            leading: CircleAvatar(
              child: Icon(entry.icon, size: 20),
            ),
            title: Text(entry.name),
            subtitle: Text('${entry.category} · ${entry.summary}'),
            onTap: () => onSelect(entry),
          );
        }),
      ],
    );
  }
}

class _SelectedStudio extends StatelessWidget {
  const _SelectedStudio({required this.entry, required this.onClear});

  final CatalogEntry entry;
  final VoidCallback onClear;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Row(
          children: <Widget>[
            Expanded(
              child: Text(entry.name, style: theme.textTheme.headlineSmall),
            ),
            TextButton.icon(
              onPressed: onClear,
              icon: const Icon(Icons.close),
              label: const Text('Clear'),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: <Widget>[
            Chip(label: Text(entry.category)),
            ...entry.keywords.take(4).map((String word) => Chip(label: Text(word))),
          ],
        ),
        const SizedBox(height: 12),
        Text(entry.summary, style: theme.textTheme.bodyLarge),
        const SizedBox(height: 20),
        Text('Live preview', style: theme.textTheme.titleMedium),
        const SizedBox(height: 8),
        Card(
          clipBehavior: Clip.antiAlias,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Center(child: CatalogPreview(entry: entry)),
          ),
        ),
      ],
    );
  }
}
