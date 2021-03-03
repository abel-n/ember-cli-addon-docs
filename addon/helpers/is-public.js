import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

const privateComponents = [];

export default class IsPublicHelper extends Helper {
  @service store

  constructor() {
    super(...arguments);

    if (!privateComponents.length) {
      let components = this.store.peekAll('component');

      privateComponents.pushObjects(components.filterBy('access', 'private'));
    }
  }

  compute([{ id }]) {
    return !privateComponents.findBy('file', id);
  }
}
