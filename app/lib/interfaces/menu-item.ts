export interface MenuItem {
  path: string;
  type: string;
  slug: string;
  title: string;
  icon: string;
  children?: MenuItem[];
  subject: string;
}
