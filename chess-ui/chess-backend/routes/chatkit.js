var Chatkit = require('@pusher/chatkit-server');

const chatkit = new Chatkit.default({
    instanceLocator:'v1:us1:f70c1694-4f22-4537-bd13-a2d660ca277b',
    key:'e7fe538e-d3c9-4e4c-bf18-b588d3a60404:aTW9BN8BMAdQ/cQxXgEmKg1GCAJjMHZW1XBrQm0eyQA='
});

module.exports = chatkit;