// @components
import {
  HomePage,
  NotFoundPage,
  SettingsPage,
} from '../pages';

const components = {
  HomePage,
  NotFoundPage,
  SettingsPage,
};

export const mapComponent = (componentName) =>
  components[componentName];
