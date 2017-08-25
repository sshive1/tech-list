import { Template } from 'meteor/templating';
import { Machines } from '../api/machines.js';

import './machine.html';

Template.machine.helpers({
  isOwner() {
    return this.owner === Meteor.userId();
  },
});

Template.machine.events({
  'click .toggle-checked'(){
    Meteor.call('machines.setChecked', this._id, !this.checked);
  },
  'click .delete'(){
    Meteor.call('machines.remove', this._id);
  },
  'click .toggle-private'() {
    Meteor.call('machines.setPrivate', this._id, !this.private);
  },
});
