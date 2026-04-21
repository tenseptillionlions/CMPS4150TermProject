const { ObjectId } = require("mongodb");
const DbSingleton = require("../config/dbSingleton");

class TaskModel {
  static async collection() {
    const db = await DbSingleton.getDb();
    return db.collection("tasks");
  }

  static async ensureIndexes() {
    const tasks = await TaskModel.collection();
    await tasks.createIndex({ ownerId: 1, createdAt: -1 });
    await tasks.createIndex({ active: 1, createdAt: -1 });
    await tasks.createIndex({ "volunteers.identifier": 1 });
  }

  static toObjectId(id) {
    try {
      return new ObjectId(id);
    } catch (error) {
      return null;
    }
  }

  static normalizeIdentifier(identifier) {
    return (identifier || "").trim().toLowerCase();
  }

  static toView(task) {
    if (!task) {
      return null;
    }

    const volunteers = Array.isArray(task.volunteers) ? task.volunteers : [];
    return {
      id: task._id.toString(),
      title: task.title,
      description: task.description || "",
      active: Boolean(task.active),
      ownerId: task.ownerId,
      ownerUsername: task.ownerUsername,
      volunteers: volunteers.map((volunteer) => ({
        identifier: volunteer.identifier,
        joinedAt: volunteer.joinedAt
      })),
      volunteerCount: volunteers.length,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    };
  }

  static async createTask({ title, description, ownerId, ownerUsername }) {
    const tasks = await TaskModel.collection();
    const now = new Date();

    const result = await tasks.insertOne({
      title: (title || "").trim(),
      description: (description || "").trim(),
      active: true,
      ownerId: String(ownerId),
      ownerUsername: ownerUsername || "unknown",
      volunteers: [],
      createdAt: now,
      updatedAt: now
    });

    const created = await tasks.findOne({ _id: result.insertedId });
    return TaskModel.toView(created);
  }

  static async getActiveTasks() {
    const tasks = await TaskModel.collection();
    const records = await tasks.find({ active: true }).sort({ createdAt: -1 }).toArray();
    return records.map(TaskModel.toView);
  }

  static async getTasksByOwner(ownerId) {
    const tasks = await TaskModel.collection();
    const records = await tasks.find({ ownerId: String(ownerId) }).sort({ createdAt: -1 }).toArray();
    return records.map(TaskModel.toView);
  }

  static async getTasksForVolunteer(identifier) {
    const tasks = await TaskModel.collection();
    const normalized = TaskModel.normalizeIdentifier(identifier);

    if (!normalized) {
      return [];
    }

    const records = await tasks
      .find({ "volunteers.identifier": normalized })
      .sort({ createdAt: -1 })
      .toArray();

    return records.map(TaskModel.toView);
  }

  static async addVolunteer(taskId, identifier) {
    const tasks = await TaskModel.collection();
    const objectId = TaskModel.toObjectId(taskId);
    const normalized = TaskModel.normalizeIdentifier(identifier);

    if (!objectId) {
      return { ok: false, reason: "invalid_task" };
    }

    if (!normalized) {
      return { ok: false, reason: "invalid_identifier" };
    }

    const task = await tasks.findOne({ _id: objectId });
    if (!task) {
      return { ok: false, reason: "not_found" };
    }

    if (!task.active) {
      return { ok: false, reason: "inactive" };
    }

    const volunteers = Array.isArray(task.volunteers) ? task.volunteers : [];
    if (!Array.isArray(task.volunteers)) {
      await tasks.updateOne(
        { _id: objectId },
        { $set: { volunteers: [], updatedAt: new Date() } }
      );
    }

    const alreadySubscribed = volunteers.some(
      (volunteer) => volunteer.identifier === normalized
    );
    if (alreadySubscribed) {
      return { ok: false, reason: "already_subscribed" };
    }

    const result = await tasks.updateOne(
      {
        _id: objectId,
        active: true,
        "volunteers.identifier": { $ne: normalized }
      },
      {
        $push: {
          volunteers: {
            identifier: normalized,
            joinedAt: new Date()
          }
        },
        $set: { updatedAt: new Date() }
      }
    );

    if (result.modifiedCount === 1) {
      return { ok: true, reason: "subscribed" };
    }

    return { ok: false, reason: "unknown" };
  }

  static async removeVolunteerForOwner(taskId, ownerId, identifier) {
    const tasks = await TaskModel.collection();
    const objectId = TaskModel.toObjectId(taskId);
    const normalized = TaskModel.normalizeIdentifier(identifier);

    if (!objectId || !normalized) {
      return false;
    }

    const result = await tasks.updateOne(
      {
        _id: objectId,
        ownerId: String(ownerId),
        "volunteers.identifier": normalized
      },
      {
        $pull: {
          volunteers: { identifier: normalized }
        },
        $set: { updatedAt: new Date() }
      }
    );

    return result.modifiedCount === 1;
  }

  static async setActiveForOwner(taskId, ownerId, active) {
    const tasks = await TaskModel.collection();
    const objectId = TaskModel.toObjectId(taskId);

    if (!objectId) {
      return null;
    }

    const result = await tasks.findOneAndUpdate(
      {
        _id: objectId,
        ownerId: String(ownerId)
      },
      {
        $set: {
          active: Boolean(active),
          updatedAt: new Date()
        }
      },
      { returnDocument: "after" }
    );

    return TaskModel.toView(result.value);
  }

  static async findById(taskId) {
    const tasks = await TaskModel.collection();
    const objectId = TaskModel.toObjectId(taskId);
    if (!objectId) {
      return null;
    }

    const task = await tasks.findOne({ _id: objectId });
    return TaskModel.toView(task);
  }

  static async getAllTasks() {
    const tasks = await TaskModel.collection();
    const records = await tasks.find({}).sort({ createdAt: -1 }).toArray();
    return records.map(TaskModel.toView);
  }
}

module.exports = TaskModel;
