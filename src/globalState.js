/*
 * Note: S3, Lambda, etc classes will be moved into their own file soon.
 */

// eslint-disable-next-line max-classes-per-file
class S3 {}

class Lambda {
  constructor({
    Role,
    Policy,
    FunctionData,
  }) {
    this.Role = Role
    this.Policy = Policy
    this.FunctionData = FunctionData
  }
}

class Firehose {}

class Timestream {}

/*
 * GlobalState is an singleton that will contain all data over the lifetime
 * of the CLI command. Currently, it is initialized to no data, however after
 * we start making the CLI stateful, it should handle fetching the cache data
 * during initialization.
 */
class GlobalState {
  constructor({
    lambda,
    s3,
    firehose,
    timestream,
  }) {
    this.Lambda = new Lambda(lambda)
    this.S3 = new S3(s3)
    this.Firehose = new Firehose(firehose)
    this.Timestream = new Timestream(timestream)
  }

  /*
   * Call this function when an error occurs and you plan to exit.
   * This function will dump the current state to the cache to prevent data loss.
   */
  dump() {
    console.log(this)
  }
}

// TODO: Load state from cache if it exists
const cache = {
  lambda: {},
  s3: {},
  firehose: {},
  timestream: {},
}
const globalState = new GlobalState(cache)

module.exports = globalState
