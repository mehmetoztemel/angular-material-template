import { Type } from "@angular/core";

export interface MenuItem {
  Icon: string;
  Label: string;
  Path?: string;
  SubItems?: MenuItem[];
  component?: Type<unknown>;
}
