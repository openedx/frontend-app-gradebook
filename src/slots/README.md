# `frontend-app-gradebook` Slots

Slot operations for this app are declared in [`src/slots.tsx`](../slots.tsx).
See the [slot naming and lifecycle ADR](https://github.com/openedx/frontend-base/blob/main/docs/decisions/0009-slot-naming-and-lifecycle.rst)
for the API and conventions.

## Slots exposed by this app

None yet. When gradebook-specific slots are added, they will be implemented
with the `<Slot />` component from [`@openedx/frontend-base`](https://github.com/openedx/frontend-base)
and documented here.

## Widgets this app contributes to other apps' slots

### `org.openedx.frontend.widget.gradebook.studentGrades.v1`

- **Target slot:** `org.openedx.frontend.slot.ccxCoach.studentGrades.v1` — the
  Student Grades tab in the CCX Coach dashboard.
- **Operation:** `WidgetOperationTypes.APPEND` (`widgetAppend`).
- **Component:** a lazy-loaded `Gradebook` behind its own `<Suspense>`
  boundary, so hosts that never render the slot do not pay for the bundle.

Operators can override this widget from their site config by targeting the id
above with any `WidgetOperationTypes` operation — e.g. `REPLACE` to swap in a
different component, or `REMOVE` to drop the gradebook from the tab.
