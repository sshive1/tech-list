import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Machines } from '../api/machines.js';

import './machine.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated(){
    this.state = new ReactiveDict();
    Meteor.subscribe('machines');
  });

Template.body.helpers({
  machines() {
    const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      return Machines.find({checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    return Machines.find({}, { sort: { createdAt: -1 } });
  },
  incompleteCount() {
    return Machines.find({ checked: { $ne: true } }).count();
  },
});

Template.body.events({
  'submit .new-machine'(event) {
    event.preventDefault();

    const target = event.target;
    const text = target.text.value;

    Meteor.call('machines.insert', text);

      target.text.value = '';
    },
    'change .hide-completed input'(event, instance) {
      instance.state.set('hideCompleted', event.target.checked);
    },
  });
