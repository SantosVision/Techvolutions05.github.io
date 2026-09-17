import 'package:flutter/material.dart';

/// One Material widget in the offline SearchAnchor Studio catalog.
class CatalogEntry {
  const CatalogEntry({
    required this.id,
    required this.name,
    required this.category,
    required this.summary,
    required this.icon,
    required this.keywords,
  });

  final String id;
  final String name;
  final String category;
  final String summary;
  final IconData icon;
  final List<String> keywords;

  bool matches(String query) {
    final String q = query.trim().toLowerCase();
    if (q.isEmpty) {
      return false;
    }
    if (name.toLowerCase().contains(q) ||
        category.toLowerCase().contains(q) ||
        summary.toLowerCase().contains(q) ||
        id.toLowerCase().contains(q)) {
      return true;
    }
    return keywords.any((String keyword) => keyword.toLowerCase().contains(q));
  }
}

/// Hardcoded Material 3 widget catalog. No network, no APIs.
class WidgetCatalog {
  WidgetCatalog._();

  static const int size = 36;

  static const List<String> popularIds = <String>[
    'search_bar',
    'search_anchor',
    'card',
    'fab',
    'navigation_bar',
    'filled_button',
  ];

  static const List<CatalogEntry> all = <CatalogEntry>[
    CatalogEntry(
      id: 'filled_button',
      name: 'FilledButton',
      category: 'Actions',
      summary: 'High-emphasis button for the primary action on a screen.',
      icon: Icons.rectangle,
      keywords: <String>['button', 'cta', 'action', 'filled'],
    ),
    CatalogEntry(
      id: 'outlined_button',
      name: 'OutlinedButton',
      category: 'Actions',
      summary: 'Medium-emphasis button with a stroked outline.',
      icon: Icons.crop_square,
      keywords: <String>['button', 'outline', 'action'],
    ),
    CatalogEntry(
      id: 'text_button',
      name: 'TextButton',
      category: 'Actions',
      summary: 'Low-emphasis button for less important actions.',
      icon: Icons.font_download_outlined,
      keywords: <String>['button', 'text', 'flat', 'action'],
    ),
    CatalogEntry(
      id: 'icon_button',
      name: 'IconButton',
      category: 'Actions',
      summary: 'Compact action that shows only an icon.',
      icon: Icons.touch_app,
      keywords: <String>['button', 'icon', 'toolbar'],
    ),
    CatalogEntry(
      id: 'fab',
      name: 'FloatingActionButton',
      category: 'Actions',
      summary: 'Circular floating button for the primary screen action.',
      icon: Icons.add_circle,
      keywords: <String>['fab', 'button', 'floating', 'add'],
    ),
    CatalogEntry(
      id: 'segmented_button',
      name: 'SegmentedButton',
      category: 'Actions',
      summary: 'Single- or multi-select group of related options.',
      icon: Icons.view_column,
      keywords: <String>['segment', 'toggle', 'select', 'button'],
    ),
    CatalogEntry(
      id: 'badge',
      name: 'Badge',
      category: 'Communication',
      summary: 'Small status count or mark overlaid on another widget.',
      icon: Icons.markunread,
      keywords: <String>['notification', 'count', 'dot'],
    ),
    CatalogEntry(
      id: 'snack_bar',
      name: 'SnackBar',
      category: 'Communication',
      summary: 'Brief message that appears at the bottom of the screen.',
      icon: Icons.announcement,
      keywords: <String>['toast', 'message', 'feedback'],
    ),
    CatalogEntry(
      id: 'banner',
      name: 'MaterialBanner',
      category: 'Communication',
      summary: 'Prominent, persistent message across the top of a page.',
      icon: Icons.campaign,
      keywords: <String>['banner', 'alert', 'message'],
    ),
    CatalogEntry(
      id: 'tooltip',
      name: 'Tooltip',
      category: 'Communication',
      summary: 'Short label shown on long-press or hover.',
      icon: Icons.info_outline,
      keywords: <String>['hint', 'hover', 'help'],
    ),
    CatalogEntry(
      id: 'card',
      name: 'Card',
      category: 'Containment',
      summary: 'Elevated or outlined surface that groups related content.',
      icon: Icons.credit_card,
      keywords: <String>['surface', 'panel', 'container'],
    ),
    CatalogEntry(
      id: 'dialog',
      name: 'AlertDialog',
      category: 'Containment',
      summary: 'Modal window for a focused decision or acknowledgement.',
      icon: Icons.web_asset,
      keywords: <String>['modal', 'dialog', 'alert', 'popup'],
    ),
    CatalogEntry(
      id: 'bottom_sheet',
      name: 'BottomSheet',
      category: 'Containment',
      summary: 'A sheet that slides up from the bottom to present content.',
      icon: Icons.vertical_align_bottom,
      keywords: <String>['sheet', 'modal', 'drawer'],
    ),
    CatalogEntry(
      id: 'divider',
      name: 'Divider',
      category: 'Containment',
      summary: 'A thin line that groups content in lists and layouts.',
      icon: Icons.horizontal_rule,
      keywords: <String>['line', 'separator', 'hairline'],
    ),
    CatalogEntry(
      id: 'list_tile',
      name: 'ListTile',
      category: 'Containment',
      summary: 'One row in a list, with optional leading, trailing, and text.',
      icon: Icons.view_list,
      keywords: <String>['list', 'row', 'tile'],
    ),
    CatalogEntry(
      id: 'expansion_tile',
      name: 'ExpansionTile',
      category: 'Containment',
      summary: 'A list tile that expands to reveal more children.',
      icon: Icons.expand_more,
      keywords: <String>['accordion', 'expand', 'collapse', 'list'],
    ),
    CatalogEntry(
      id: 'app_bar',
      name: 'AppBar',
      category: 'Navigation',
      summary: 'Top bar with a title, actions, and optional navigation.',
      icon: Icons.web_asset_outlined,
      keywords: <String>['toolbar', 'header', 'top'],
    ),
    CatalogEntry(
      id: 'navigation_bar',
      name: 'NavigationBar',
      category: 'Navigation',
      summary: 'Material 3 bottom destinations for top-level screens.',
      icon: Icons.dock,
      keywords: <String>['bottom', 'nav', 'tabs', 'destinations'],
    ),
    CatalogEntry(
      id: 'navigation_rail',
      name: 'NavigationRail',
      category: 'Navigation',
      summary: 'Side destinations for tablet and desktop layouts.',
      icon: Icons.view_sidebar,
      keywords: <String>['rail', 'side', 'nav', 'desktop'],
    ),
    CatalogEntry(
      id: 'navigation_drawer',
      name: 'NavigationDrawer',
      category: 'Navigation',
      summary: 'Slide-in pane of destinations and account options.',
      icon: Icons.menu_open,
      keywords: <String>['drawer', 'menu', 'hamburger', 'side'],
    ),
    CatalogEntry(
      id: 'tab_bar',
      name: 'TabBar',
      category: 'Navigation',
      summary: 'Tabs that switch between views in the same hierarchy.',
      icon: Icons.tab,
      keywords: <String>['tabs', 'pages', 'swipe'],
    ),
    CatalogEntry(
      id: 'bottom_app_bar',
      name: 'BottomAppBar',
      category: 'Navigation',
      summary: 'Bottom bar that can host a FAB notch and icon actions.',
      icon: Icons.border_bottom,
      keywords: <String>['bottom', 'bar', 'fab', 'nav'],
    ),
    CatalogEntry(
      id: 'checkbox',
      name: 'Checkbox',
      category: 'Selection',
      summary: 'Binary on/off control for a single option in a list.',
      icon: Icons.check_box,
      keywords: <String>['check', 'boolean', 'form'],
    ),
    CatalogEntry(
      id: 'radio',
      name: 'Radio',
      category: 'Selection',
      summary: 'Choose exactly one option from a small set.',
      icon: Icons.radio_button_checked,
      keywords: <String>['radio', 'choice', 'form'],
    ),
    CatalogEntry(
      id: 'switch',
      name: 'Switch',
      category: 'Selection',
      summary: 'Toggle that immediately turns a setting on or off.',
      icon: Icons.toggle_on,
      keywords: <String>['toggle', 'boolean', 'settings'],
    ),
    CatalogEntry(
      id: 'slider',
      name: 'Slider',
      category: 'Selection',
      summary: 'Pick a value from a continuous or stepped range.',
      icon: Icons.tune,
      keywords: <String>['range', 'volume', 'seek'],
    ),
    CatalogEntry(
      id: 'filter_chip',
      name: 'FilterChip',
      category: 'Selection',
      summary: 'Chip that toggles a filter in a set of results.',
      icon: Icons.filter_list,
      keywords: <String>['chip', 'filter', 'tag'],
    ),
    CatalogEntry(
      id: 'date_picker',
      name: 'DatePicker',
      category: 'Selection',
      summary: 'Calendar dialog for choosing a calendar date.',
      icon: Icons.calendar_today,
      keywords: <String>['date', 'calendar', 'picker'],
    ),
    CatalogEntry(
      id: 'text_field',
      name: 'TextField',
      category: 'Text inputs',
      summary: 'Single-line or multi-line text entry with a Material decoration.',
      icon: Icons.short_text,
      keywords: <String>['input', 'form', 'edit', 'field'],
    ),
    CatalogEntry(
      id: 'search_bar',
      name: 'SearchBar',
      category: 'Text inputs',
      summary: 'Material 3 search field; often the visible SearchAnchor.',
      icon: Icons.search,
      keywords: <String>['search', 'query', 'bar', 'typeahead'],
    ),
    CatalogEntry(
      id: 'search_anchor',
      name: 'SearchAnchor',
      category: 'Text inputs',
      summary: 'Opens a search view with type-ahead suggestions as you type.',
      icon: Icons.manage_search,
      keywords: <String>['search', 'suggest', 'typeahead', 'autocomplete'],
    ),
    CatalogEntry(
      id: 'dropdown_menu',
      name: 'DropdownMenu',
      category: 'Text inputs',
      summary: 'Text field plus a menu of selectable entries.',
      icon: Icons.arrow_drop_down_circle,
      keywords: <String>['dropdown', 'select', 'combo', 'menu'],
    ),
    CatalogEntry(
      id: 'chip',
      name: 'Chip',
      category: 'Selection',
      summary: 'Compact element for an attribute, contact, or action.',
      icon: Icons.label,
      keywords: <String>['chip', 'tag', 'assist'],
    ),
    CatalogEntry(
      id: 'progress',
      name: 'CircularProgressIndicator',
      category: 'Communication',
      summary: 'Determinate or indeterminate circular loading indicator.',
      icon: Icons.refresh,
      keywords: <String>['loading', 'spinner', 'progress', 'wait'],
    ),
    CatalogEntry(
      id: 'menu_anchor',
      name: 'MenuAnchor',
      category: 'Actions',
      summary: 'Anchor that opens a Material 3 menu of items.',
      icon: Icons.more_vert,
      keywords: <String>['menu', 'overflow', 'dropdown'],
    ),
    CatalogEntry(
      id: 'time_picker',
      name: 'TimePicker',
      category: 'Selection',
      summary: 'Dial or input dialog for choosing a time of day.',
      icon: Icons.schedule,
      keywords: <String>['time', 'clock', 'picker'],
    ),
  ];

  static List<CatalogEntry> get popular {
    return popularIds
        .map(
          (String id) => all.firstWhere((CatalogEntry entry) => entry.id == id),
        )
        .toList(growable: false);
  }

  static List<CatalogEntry> search(String query) {
    return all.where((CatalogEntry entry) => entry.matches(query)).toList();
  }

  static CatalogEntry? byName(String name) {
    for (final CatalogEntry entry in all) {
      if (entry.name.toLowerCase() == name.trim().toLowerCase()) {
        return entry;
      }
    }
    return null;
  }
}

/// Compact live preview for a catalog entry.
class CatalogPreview extends StatelessWidget {
  const CatalogPreview({super.key, required this.entry});

  final CatalogEntry entry;

  @override
  Widget build(BuildContext context) {
    switch (entry.id) {
      case 'filled_button':
        return FilledButton(onPressed: () {}, child: const Text('Filled'));
      case 'outlined_button':
        return OutlinedButton(onPressed: () {}, child: const Text('Outlined'));
      case 'text_button':
        return TextButton(onPressed: () {}, child: const Text('Text'));
      case 'icon_button':
        return IconButton.filled(onPressed: () {}, icon: const Icon(Icons.favorite));
      case 'fab':
        return FloatingActionButton.small(
          onPressed: () {},
          child: const Icon(Icons.add),
        );
      case 'segmented_button':
        return SegmentedButton<int>(
          segments: const <ButtonSegment<int>>[
            ButtonSegment<int>(value: 0, label: Text('Day')),
            ButtonSegment<int>(value: 1, label: Text('Week')),
          ],
          selected: const <int>{0},
          onSelectionChanged: (_) {},
        );
      case 'badge':
        return const Badge(
          label: Text('3'),
          child: Icon(Icons.notifications, size: 28),
        );
      case 'snack_bar':
        return FilledButton.tonal(
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Saved to the catalog.')),
            );
          },
          child: const Text('Show SnackBar'),
        );
      case 'banner':
        return MaterialBanner(
          content: const Text('A MaterialBanner stays until dismissed.'),
          actions: <Widget>[
            TextButton(onPressed: () {}, child: const Text('Got it')),
          ],
        );
      case 'tooltip':
        return const Tooltip(
          message: 'Delete this widget',
          child: Icon(Icons.delete, size: 28),
        );
      case 'card':
        return const Card(
          child: ListTile(
            leading: Icon(Icons.widgets),
            title: Text('Card'),
            subtitle: Text('Grouped content'),
          ),
        );
      case 'dialog':
        return FilledButton.tonal(
          onPressed: () {
            showDialog<void>(
              context: context,
              builder: (BuildContext context) {
                return AlertDialog(
                  title: const Text('Use SearchAnchor?'),
                  content: const Text('Type-ahead over a local Material catalog.'),
                  actions: <Widget>[
                    TextButton(
                      onPressed: () => Navigator.pop(context),
                      child: const Text('Close'),
                    ),
                  ],
                );
              },
            );
          },
          child: const Text('Open dialog'),
        );
      case 'bottom_sheet':
        return FilledButton.tonal(
          onPressed: () {
            showModalBottomSheet<void>(
              context: context,
              showDragHandle: true,
              builder: (BuildContext context) {
                return const Padding(
                  padding: EdgeInsets.all(24),
                  child: Text('This is a modal BottomSheet.'),
                );
              },
            );
          },
          child: const Text('Open sheet'),
        );
      case 'divider':
        return const Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            Text('Above'),
            Divider(),
            Text('Below'),
          ],
        );
      case 'list_tile':
        return const ListTile(
          leading: Icon(Icons.palette),
          title: Text('ListTile'),
          subtitle: Text('One row'),
          trailing: Icon(Icons.chevron_right),
        );
      case 'expansion_tile':
        return const ExpansionTile(
          title: Text('ExpansionTile'),
          children: <Widget>[
            ListTile(title: Text('Nested detail')),
          ],
        );
      case 'app_bar':
        return SizedBox(
          height: 56,
          child: Material(
            elevation: 1,
            child: AppBar(
              title: const Text('AppBar'),
              automaticallyImplyLeading: false,
            ),
          ),
        );
      case 'navigation_bar':
        return NavigationBar(
          selectedIndex: 0,
          destinations: const <Widget>[
            NavigationDestination(icon: Icon(Icons.home), label: 'Home'),
            NavigationDestination(icon: Icon(Icons.search), label: 'Search'),
            NavigationDestination(icon: Icon(Icons.person), label: 'You'),
          ],
          onDestinationSelected: (_) {},
        );
      case 'navigation_rail':
        return SizedBox(
          height: 160,
          child: NavigationRail(
            selectedIndex: 0,
            labelType: NavigationRailLabelType.all,
            destinations: const <NavigationRailDestination>[
              NavigationRailDestination(
                icon: Icon(Icons.home_outlined),
                selectedIcon: Icon(Icons.home),
                label: Text('Home'),
              ),
              NavigationRailDestination(
                icon: Icon(Icons.star_outline),
                selectedIcon: Icon(Icons.star),
                label: Text('Saved'),
              ),
            ],
            onDestinationSelected: (_) {},
          ),
        );
      case 'navigation_drawer':
        return const ListTile(
          leading: Icon(Icons.menu),
          title: Text('NavigationDrawer'),
          subtitle: Text('Slide-in destinations'),
        );
      case 'tab_bar':
        return DefaultTabController(
          length: 3,
          child: TabBar(
            tabs: const <Widget>[
              Tab(text: 'News'),
              Tab(text: 'Photos'),
              Tab(text: 'Shop'),
            ],
          ),
        );
      case 'bottom_app_bar':
        return const BottomAppBar(
          child: Row(
            children: <Widget>[
              Icon(Icons.menu),
              Spacer(),
              Icon(Icons.search),
              SizedBox(width: 16),
              Icon(Icons.more_vert),
            ],
          ),
        );
      case 'checkbox':
        return Checkbox(value: true, onChanged: (_) {});
      case 'radio':
        return RadioGroup<int>(
          groupValue: 1,
          onChanged: (_) {},
          child: const Radio<int>(value: 1),
        );
      case 'switch':
        return Switch(value: true, onChanged: (_) {});
      case 'slider':
        return Slider(value: 0.45, onChanged: (_) {});
      case 'filter_chip':
        return FilterChip(
          label: const Text('Material 3'),
          selected: true,
          onSelected: (_) {},
        );
      case 'date_picker':
        return FilledButton.tonal(
          onPressed: () {
            showDatePicker(
              context: context,
              firstDate: DateTime(2020),
              lastDate: DateTime(2030),
              initialDate: DateTime(2026, 9, 17),
            );
          },
          child: const Text('Pick a date'),
        );
      case 'text_field':
        return const TextField(
          decoration: InputDecoration(
            border: OutlineInputBorder(),
            labelText: 'Label',
            hintText: 'Type here',
          ),
        );
      case 'search_bar':
        return SearchBar(
          hintText: 'Search widgets',
          leading: const Icon(Icons.search),
          onTap: () {},
        );
      case 'search_anchor':
        return SearchAnchor.bar(
          barHintText: 'Nested SearchAnchor',
          suggestionsBuilder: (BuildContext context, SearchController controller) {
            return const <Widget>[
              ListTile(title: Text('This is a nested SearchAnchor demo.')),
            ];
          },
        );
      case 'dropdown_menu':
        return DropdownMenu<String>(
          initialSelection: 'One',
          dropdownMenuEntries: const <DropdownMenuEntry<String>>[
            DropdownMenuEntry<String>(value: 'One', label: 'One'),
            DropdownMenuEntry<String>(value: 'Two', label: 'Two'),
          ],
        );
      case 'chip':
        return const Chip(avatar: Icon(Icons.tag, size: 16), label: Text('Chip'));
      case 'progress':
        return const SizedBox(
          width: 36,
          height: 36,
          child: CircularProgressIndicator(),
        );
      case 'menu_anchor':
        return MenuAnchor(
          builder: (BuildContext context, MenuController controller, Widget? child) {
            return IconButton(
              icon: const Icon(Icons.more_vert),
              onPressed: () {
                if (controller.isOpen) {
                  controller.close();
                } else {
                  controller.open();
                }
              },
            );
          },
          menuChildren: const <Widget>[
            MenuItemButton(child: Text('Edit')),
            MenuItemButton(child: Text('Share')),
          ],
        );
      case 'time_picker':
        return FilledButton.tonal(
          onPressed: () {
            showTimePicker(context: context, initialTime: TimeOfDay.now());
          },
          child: const Text('Pick a time'),
        );
      default:
        return Text(entry.name);
    }
  }
}
