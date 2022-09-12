#!/usr/bin/env zsh

if [ -z $1 ] || [ -z $2 ]; then
    echo "usage: delete-aws-lambda-layer-versions.sh [LAYER_NAME] [NUMBER_OF_VERSIONS]"
    exit 1
fi

LAYER_NAME=$1
NUMBER_OF_VERSIONS=$2

for i in {1..$NUMBER_OF_VERSIONS}
do
    echo "Deleting layer [$LAYER_NAME] and version [$i]"

    aws lambda delete-layer-version \
        --layer-name $LAYER_NAME \
        --version-number $i

done
