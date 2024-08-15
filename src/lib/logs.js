import Auditlogs from "@/models/Auditlogs";
import dbConnect from "@/lib/dbConnect";

async function log(action, user, ip, description = null) {
    await dbConnect();

    const newLog = new Auditlogs({
        action,
        user,
        ip,
        description,
        time: new Date(),
    });

    await newLog.save();
}

async function getLogs(filter = {}) {
    await dbConnect();

    // Build the query object
    const query = {
        time: { $gte: new Date(Date.now() - 60 * 60 * 1000) }, // Default: last 1 hour
        ...filter, // Spread the filter object to add any additional filters
    };

    const logs = await Auditlogs.find(query);

    return logs;
}

async function clearLogs() {
    await dbConnect();

    await Auditlogs.deleteMany({});
}

async function clearOldLogs() {
    await dbConnect();

    await Auditlogs.deleteMany({ time: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } });
}

export { log, getLogs, clearLogs, clearOldLogs };
