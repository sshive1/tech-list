import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import { assert } from 'meteor/practicalmeteor:chai';

import { Machines } from './machines.js';

if (Meteor.isServer) {
  describe('Machines', () => {
    describe('methods', () => {
      const userId = Random.id();
      let machineId;

      beforeEach(() => {
        Machines.remove({});
          machineId = Machines.insert({
            text: 'test machine',
            createdAt: new Date(),
            owner: userId,
            username: 'tmeasday',
            });
        });
      it('can delete owned machine', () => {

        const deleteMachine = Meteor.server.method_handlers['machines.remove'];

        const invocation = { userId };

        deleteMachine.apply(invocation, [machineId]);

        assert.equal(Machines.find().count(), 0);
        });
      });
    });
}
