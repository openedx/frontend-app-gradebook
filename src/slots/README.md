# `frontend-app-gradebook` Slots

This app does not currently offer any slots of its own. The header and footer
are provided by the host site's configuration (e.g. frontend-base's `headerApp`
and `footerApp`), not by this app. When gradebook-specific slots are added,
they will be implemented with the `<Slot />` component from
[`@openedx/frontend-base`](https://github.com/openedx/frontend-base) and
documented here; see the [slot naming and lifecycle ADR](https://github.com/openedx/frontend-base/blob/main/docs/decisions/0009-slot-naming-and-lifecycle.rst)
for the API and conventions.
