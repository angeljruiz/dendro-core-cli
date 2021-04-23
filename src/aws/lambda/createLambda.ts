import * as fs from 'fs';
import * as path from 'path';
import { AWSError } from 'aws-sdk';
import AdmZip from 'adm-zip';

import store from '../../store';
import { AWS_LAMBDA } from '../../constants';

interface LambdaData {
  lambdaFile: string,
  Role: string,
  DATABASE_NAME: string,
  Runtime: string,
  region: string,
  Description: string
}

export default function createLambda({
  lambdaFile,
  Role = store.AWS.IAM.Arn!,
  DATABASE_NAME,
  Runtime = 'nodejs12.x',
  Description = '',
}: LambdaData): Promise<any> {
  return new Promise(resolve => {
    const lambdaName = lambdaFile.replace(/\.js/, '');

    if (!fs.existsSync(lambdaFile)) {
      throw new Error('Can\'t find lambda file');
    }

    const zip = new AdmZip();

    zip.addLocalFile(lambdaFile);

    const params = {
      Code: {
        ZipFile: zip.toBuffer(),
      },
      FunctionName: path.basename(lambdaName),
      Handler: `${lambdaName}.handler`,
      Role,
      Runtime,
      Description,
      Timeout: '180',
      Environment: {
        Variables: {
          DATABASE_NAME,
        },
      },
    };

    AWS_LAMBDA.createFunction(params, (err: AWSError, data) => {
      if (err && err.code !== 'ResourceConflictException') throw new Error(String(err));
      else resolve(data);
    });
  });
}

