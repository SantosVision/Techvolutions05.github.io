import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:searchanchor_studio/main.dart';
import 'package:searchanchor_studio/widget_catalog.dart';

void main() {
  testWidgets('Studio loads SearchBar and catalog', (WidgetTester tester) async {
    await tester.pumpWidget(const SearchAnchorStudioApp());

    expect(find.text('SEARCHANCHOR STUDIO'), findsOneWidget);
    expect(find.textContaining('Type-ahead over Material widgets'), findsOneWidget);
    expect(find.byType(SearchBar), findsWidgets);
    expect(find.text('Popular widgets'), findsOneWidget);
    expect(find.text('FilledButton'), findsWidgets);
  });

  testWidgets('Selecting a popular chip shows the widget detail', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(const SearchAnchorStudioApp());

    await tester.tap(find.widgetWithText(ActionChip, 'Card'));
    await tester.pumpAndSettle();

    expect(find.text('Live preview'), findsOneWidget);
    expect(find.widgetWithText(TextButton, 'Clear'), findsOneWidget);
  });

  test('Catalog has 36 Material widgets and searchable names', () {
    expect(WidgetCatalog.all.length, WidgetCatalog.size);
    expect(WidgetCatalog.all.map((CatalogEntry e) => e.id).toSet().length, 36);
    expect(WidgetCatalog.search('card').map((CatalogEntry e) => e.name), contains('Card'));
    expect(WidgetCatalog.search('typeahead').map((CatalogEntry e) => e.id), contains('search_anchor'));
    expect(WidgetCatalog.search('zzzz-no-such-widget'), isEmpty);
    expect(WidgetCatalog.popular, hasLength(6));
    expect(WidgetCatalog.byName('SearchBar')?.id, 'search_bar');
  });
}
