const tf = require("@tensorflow/tfjs")

const build_model = () =>
{
    const model = tf.sequential();

    model.add (tf.layers.conv2d({
        inputShape: [ 28 , 28, 1],
        kernelSize: 5,
        filters: 8,
        strides:1,
        activation:"relu",
        kernelInitializer: "varianceScaling"
    }));

    model.add(tf.layers.maxPooling2d({poolSize:[2,2], strides:[2,2]}));

    model.add(tf.layers.conv2d({
        kernelSize: 5,
        filters: 16,
        strides: 1,
        activation: 'relu',
        kernelInitializer: 'varianceScaling'
    }));

    model.add(tf.layers.maxPooling2d({poolSize:[2,2], strides:[2,2]}));

    model.add(tf.layers.flatten());

    model.add(tf.layers.dense({
        units: 2,
        kernelnitializer: 'varianceScaling',
        activation: 'softmax'
    }));
    const optimizer = tf.train.adam();
    model.compile({
        optimizer: optimizer,
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
    });

  return model;
}

const train_model = async (model, data) => {

  const BATCH_SIZE = 10;
  const TRAIN_DATA_SIZE = 50;
  const TEST_DATA_SIZE = 20;

  const train_data = data.get_next_train_set(50)
  const test_data = data.get_next_test_set(20)

  return model.fit(train_data.data, train_data.labels, {
    batchSize: BATCH_SIZE,
    validationData: [test_data.data, test_data.labels],
    epochs: 10,
    shuffle: true,
  });
}


const predict = (model, data) => {
    const testdata = data.get_next_test_set(1)

    const predictions = model.predict(testdata.data);

    return {pred: predictions, real: testdata.labels}
}

module.exports = {build_model, train_model, predict}
