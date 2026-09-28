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

**Props (host-supplied as extra props on the `<Slot />`):**

| Prop       | Type          | Required | Description |
| ---------- | ------------- | -------- | ----------- |
| `courseId` | `string`      | yes      | Course whose gradebook is rendered. The widget reads it from this prop; it does not fall back to the host's URL. |
| `onBack`   | `() => void`  | no       | Invoked by the "Back to Dashboard" link inside the widget. Supply it when the widget lives in an SPA tab so navigation stays in-app; omit to fall back to the LMS instructor dashboard URL. |

Per [ADR 0009](https://github.com/openedx/frontend-base/blob/main/docs/decisions/0009-slot-naming-and-lifecycle.rst), these props are the versioned part of the widget contract.

Example use from a host site:

```tsx
<Slot
  id="org.openedx.frontend.slot.ccxCoach.studentGrades.v1"
  courseId={courseId}
  onBack={() => navigate('..')}
/>
```

- **Target slot:** `org.openedx.frontend.slot.ccxCoach.studentGrades.v1` — the
  tab content of Student Grades tab in the CCX Coach dashboard.
- **Operation:** `WidgetOperationTypes.APPEND` (`widgetAppend`).
- **Component:** a lazy-loaded `Gradebook` behind its own `<Suspense>`
  boundary, so hosts that never render the slot do not pay for the bundle.

Operators can override this widget from their site config by targeting the id
above with any `WidgetOperationTypes` operation — e.g. `REPLACE` to swap in a
different component, or `REMOVE` to drop the gradebook from the tab.
