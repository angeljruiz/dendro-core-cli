import store from '../../store';

const logConfig = (): string => {
  return `
\n################ Postgres Logs #############################

[sources.postgres_logs]
type = "file"
include = ["/var/log/postgresql/*.log"]
read_from = "beginning"

[transforms.postgres_logs_add_transform]
type = "remap"
inputs = ["postgres_logs"]
source = '''
.type = "postgres"
'''

[sinks.postgres_logs_firehose_stream_sink]
# General
type = "aws_kinesis_firehose" # required
inputs = ["postgres_logs_add_transform"] # required
region = "us-east-2" # required, required when endpoint = null
stream_name = "PostgresDendroStream" # required
auth.access_key_id = "${store.AWS.Credentials?.accessKeyId}"
auth.secret_access_key = "${store.AWS.Credentials?.secretAccessKey}"
# Encoding
encoding.codec = "json" # required
# Healthcheck
healthcheck.enabled = true # optional, default

#############################################\n
    `;
};

// TODO
const metricConfig = (): string => {
  console.log('Not Implemented');
  return '';
};

export const buildPostgresConfig = (): string => {
  let config = '';

  if (store.Vector.Postgres?.monitorMetrics) {
    config += metricConfig();
  }

  if (store.Vector.Postgres?.monitorErrorLogs) {
    config += logConfig();
  }

  return config;
};