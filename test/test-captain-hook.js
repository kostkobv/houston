'use strict';

const chai = require('chai');
const request = require('supertest');
const expect = chai.expect;
const appModule = require('../app/module.js');
const seneca = require('seneca')();

const ROLLBAR_DATA = {
  event_name: 'test',
  data: {
    item: {
      public_item_id: null,
      integrations_data: {},
      last_activated_timestamp: 1382655421,
      unique_occurrences: null,
      id: 272716944,
      environment: 'production',
      title: 'testing aobg98wrwe',
      last_occurrence_id: 481761639,
      last_occurrence_timestamp: 1382655421,
      platform: 0,
      first_occurrence_timestamp: 1382655421,
      project_id: 90,
      resolved_in_version: null,
      status: 1,
      hash: 'c595b2ae0af9b397bb6bdafd57104ac4d5f6b382',
      last_occurrence: {
        body: {
          message: {
            body: 'testing aobg98wrwe'
          }
        },
        uuid: 'd2036647-e0b7-4cad-bc98-934831b9b6d1',
        language: 'python',
        level: 'error',
        timestamp: 1382655421,
        server: {
          host: 'dev',
          argv: [
            ''
          ]
        },
        environment: 'production',
        framework: 'unknown',
        notifier: {
          version: '0.5.12',
          name: 'pyrollbar'
        },
        metadata: {
          access_token: '',
          debug: {
            routes: {
              start_time: 1382212080401,
              counters: {
                post_item: 3274122
              }
            }
          },
          customer_timestamp: 1382655421,
          api_server_hostname: 'web6'
        }
      },
      framework: 0,
      total_occurrences: 1,
      level: 40,
      counter: 4,
      first_occurrence_id: 481761639,
      activating_occurrence_id: 481761639
    }
  }
};

chai.should();

describe('Captain Hook', () => {
  before(() => {
    this.testModule = appModule.getModule('captain-hook');

    const PORT = this.testModule._moduleConfigsBundle.get('PORT');
    this.request = request(`http://localhost:${PORT}`);

    this.testModule.init();
  });

  after(() => {
    delete this.testModule;
  });

  it('should create server on port retrieved from config', (done) => {
    this.request
      .get('/')
      // for now we don't have anything on root
      .expect(404)
      .end((err) => {
        expect(err).to.be.equal(null);

        done();
      });
  });

  describe('Server', () => {
    it('should register endpoints from configs', (done) => {
      const dataSources = this.testModule._moduleConfigsBundle.get('data-sources');
      const promises = [];

      for (const source of Object.keys(dataSources)) {
        const promise = new Promise((resolve) => {
          this.request
            .post(dataSources[source].endpoint)
            .send()
            .expect(204)
            .end((err) => {
              expect(err).to.be.equal(null);

              resolve();
            });
        });

        promises.push(promise);
      }

      Promise.all(promises).then(() => {
        done();
      });
    });

    it('should pass the data through the pubsub channel from configs', (done) => {
      const PARSER = this.testModule._moduleConfigsBundle.get('pubsub:channels:parser:name');
      const ROLLBAR = 'test';
      const ROLLBAR_WEBHOOK_PATH = this.testModule._moduleConfigsBundle.get('data-sources:test:endpoint');

      seneca
        .use('redis-transport')
        .listen({
          type: 'redis',
          pin: `role:${PARSER}`
        })
        .add(`role:${PARSER}`, (args, respond) => {
          expect(args.data).to.deep.equal(ROLLBAR_DATA);
          expect(args.source).to.equal(ROLLBAR);
          respond(null);
          seneca.close();
          done();
        })
        .ready((err) => {
          expect(err).to.be.equal(undefined);

          this.request
            .post(ROLLBAR_WEBHOOK_PATH)
            .send(ROLLBAR_DATA)
            .expect(204)
            .end((error) => {
              expect(error).to.be.equal(null);
            });
        });
    });
  });
});
