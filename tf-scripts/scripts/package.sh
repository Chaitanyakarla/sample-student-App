#!/bin/bash

rm my-deployment-package.zip

pip install --target package_pymysql PyMySQL

pip install --target package_pymysql redis

cd package_pymysql

zip -r ../my-deployment-package.zip .

cd ..

zip -g my-deployment-package.zip lambda_studentapp.py

rm -r package_pymysql