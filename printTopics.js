const aiTopicsModule = require('./aiTopics');

for (const index in aiTopicsModule.aiTopics) {
    const topic = aiTopicsModule.aiTopics[index];
    console.log(topic.sujet + ': ' + topic.description);
}