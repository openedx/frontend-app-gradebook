import { getUrlByRouteRole, LinkMenuItem, MenuItemName } from '@openedx/frontend-base';

interface GradebookMenuItemProps {
  label: MenuItemName,
  role: string,
  variant?: 'hyperlink' | 'navLink' | 'navDropdownItem' | 'dropdownItem',
}

export default function GradebookMenuItem({ label, role, variant = 'hyperlink' }: GradebookMenuItemProps) {
  const url = getUrlByRouteRole(role) ?? '#';

  return (
    <LinkMenuItem
      label={label}
      url={url}
      variant={variant}
    />
  );
}
