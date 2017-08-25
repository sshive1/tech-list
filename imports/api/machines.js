import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Machines = new Mongo.Collection('machines');

if (Meteor.isServer) {
  Meteor.publish('machines', function machinesPublication(){
    return Machines.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
        ],
      });
  });
}

Meteor.methods({
  'machines.insert'(text) {
     check(text, String);

     if (! Meteor.userId()) {
       throw new Meteor.Error('not-authorized');
     }

     Machines.insert({
       text,
       createdAt: new Date(),
       owner: Meteor.userId(),
       username: Meteor.user().username,
       });
  },
  'machines.remove'(machineId) {
    check(machineId, String);

    const machine = Machines.findOne(machineId);
    if (machine.private && machine.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Machine.remove(machineId);
  },
  'machines.setChecked'(machineId, setChecked) {
    check(machineId, String);
    check(setChecked, Boolean);

    const machine = Machines.findOne(machineId);
    if (machine.private && machine.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Machines.update(machineId, { $set: { checked: setChecked } });
  },
  'machines.setPrivate'(machineId, setToPrivate){
    check(machineId, String);
    check(setToPrivate, Boolean);

    const machine = Machines.findOne(machineId);

    if(machine.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Machines.update(machineId, { $set: { private: setToPrivate } });
  },
});
