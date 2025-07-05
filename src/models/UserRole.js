import mongoose from "mongoose";

const UserRoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Role name is required"],
      unique: true,
      maxlength: [50, "Role name cannot exceed 50 characters"],
    },
    displayName: {
      type: String,
      required: [true, "Display name is required"],
      maxlength: [100, "Display name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      maxlength: [300, "Description cannot exceed 300 characters"],
    },
    level: {
      type: Number,
      required: [true, "Role level is required"],
      min: [1, "Role level must be at least 1"],
      max: [10, "Role level cannot exceed 10"],
    },
    permissions: {
      // Dashboard permissions
      dashboard: {
        view: { type: Boolean, default: false },
        analytics: { type: Boolean, default: false },
      },

      // User management permissions
      users: {
        view: { type: Boolean, default: false },
        create: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
        changeRole: { type: Boolean, default: false },
      },

      // Room management permissions
      rooms: {
        view: { type: Boolean, default: false },
        create: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
        maintenance: { type: Boolean, default: false },
      },

      // Booking management permissions
      bookings: {
        view: { type: Boolean, default: false },
        create: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
        checkIn: { type: Boolean, default: false },
        checkOut: { type: Boolean, default: false },
        cancel: { type: Boolean, default: false },
      },

      // Restaurant management permissions
      restaurant: {
        view: { type: Boolean, default: false },
        manageMenu: { type: Boolean, default: false },
        manageOrders: { type: Boolean, default: false },
        manageReservations: { type: Boolean, default: false },
        viewReports: { type: Boolean, default: false },
      },

      // Event management permissions
      events: {
        view: { type: Boolean, default: false },
        create: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
        manage: { type: Boolean, default: false },
      },

      // Payment management permissions
      payments: {
        view: { type: Boolean, default: false },
        process: { type: Boolean, default: false },
        refund: { type: Boolean, default: false },
        viewReports: { type: Boolean, default: false },
      },

      // Gallery management permissions
      gallery: {
        view: { type: Boolean, default: false },
        upload: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
        approve: { type: Boolean, default: false },
      },

      // System settings permissions
      settings: {
        view: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        backup: { type: Boolean, default: false },
        restore: { type: Boolean, default: false },
      },

      // Reporting permissions
      reports: {
        view: { type: Boolean, default: false },
        generate: { type: Boolean, default: false },
        export: { type: Boolean, default: false },
        schedule: { type: Boolean, default: false },
      },

      // Staff management permissions
      staff: {
        view: { type: Boolean, default: false },
        create: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
        schedule: { type: Boolean, default: false },
      },

      // Communication permissions
      communication: {
        sendNotifications: { type: Boolean, default: false },
        sendEmails: { type: Boolean, default: false },
        sendSMS: { type: Boolean, default: false },
        manageFeedback: { type: Boolean, default: false },
      },
    },
    restrictions: {
      maxUsers: {
        type: Number,
        default: null, // null means no limit
      },
      maxRooms: {
        type: Number,
        default: null,
      },
      maxBookings: {
        type: Number,
        default: null,
      },
      workingHours: {
        start: {
          type: String,
          match: /^([01]\d|2[0-3]):([0-5]\d)$/,
        },
        end: {
          type: String,
          match: /^([01]\d|2[0-3]):([0-5]\d)$/,
        },
      },
      allowedDays: [
        {
          type: String,
          enum: [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ],
        },
      ],
      ipWhitelist: [
        {
          type: String,
          match: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/,
        },
      ],
    },
    color: {
      type: String,
      default: "#6b7280",
      match: /^#[0-9a-fA-F]{6}$/,
    },
    icon: {
      type: String,
      default: "user",
      maxlength: [50, "Icon name cannot exceed 50 characters"],
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
UserRoleSchema.index({ level: 1 });
UserRoleSchema.index({ isActive: 1 });
UserRoleSchema.index({ isSystem: 1 });

// Pre-save middleware to ensure system roles cannot be deleted
UserRoleSchema.pre("deleteOne", function (next) {
  if (this.isSystem) {
    const error = new Error("System roles cannot be deleted");
    error.statusCode = 400;
    return next(error);
  }
  next();
});

// Virtual for permission count
UserRoleSchema.virtual("permissionCount").get(function () {
  let count = 0;
  const permissions = this.permissions;

  for (const moduleKey in permissions) {
    if (typeof permissions[moduleKey] === "object") {
      for (const action in permissions[moduleKey]) {
        if (permissions[moduleKey][action] === true) {
          count++;
        }
      }
    }
  }

  return count;
});

// Method to check if role has specific permission
UserRoleSchema.methods.hasPermission = function (moduleKey, action) {
  return (
    this.permissions[moduleKey] && this.permissions[moduleKey][action] === true
  );
};

// Method to get all permissions as flat array
UserRoleSchema.methods.getFlatPermissions = function () {
  const flatPermissions = [];
  const permissions = this.permissions;

  for (const moduleKey in permissions) {
    if (typeof permissions[moduleKey] === "object") {
      for (const action in permissions[moduleKey]) {
        if (permissions[moduleKey][action] === true) {
          flatPermissions.push(`${moduleKey}.${action}`);
        }
      }
    }
  }

  return flatPermissions;
};

// Method to add permission
UserRoleSchema.methods.addPermission = function (moduleKey, action) {
  if (this.permissions[moduleKey]) {
    this.permissions[moduleKey][action] = true;
    return this.save();
  }
  throw new Error(`Module ${moduleKey} does not exist`);
};

// Method to remove permission
UserRoleSchema.methods.removePermission = function (moduleKey, action) {
  if (this.permissions[moduleKey]) {
    this.permissions[moduleKey][action] = false;
    return this.save();
  }
  throw new Error(`Module ${moduleKey} does not exist`);
};

// Static method to get default roles
UserRoleSchema.statics.getDefaultRoles = function () {
  return [
    {
      name: "super-admin",
      displayName: "Super Administrator",
      description: "Full system access with all permissions",
      level: 10,
      isSystem: true,
      color: "#dc2626",
      icon: "shield-check",
    },
    {
      name: "admin",
      displayName: "Administrator",
      description: "Full hotel management access",
      level: 9,
      isSystem: true,
      color: "#7c3aed",
      icon: "settings",
    },
    {
      name: "manager",
      displayName: "Manager",
      description: "Department management access",
      level: 7,
      isSystem: true,
      color: "#0891b2",
      icon: "briefcase",
    },
    {
      name: "receptionist",
      displayName: "Receptionist",
      description: "Front desk and booking management",
      level: 5,
      isSystem: true,
      color: "#059669",
      icon: "user-check",
    },
    {
      name: "staff",
      displayName: "Staff Member",
      description: "Basic operational access",
      level: 3,
      isSystem: true,
      color: "#d97706",
      icon: "user",
    },
    {
      name: "guest",
      displayName: "Guest",
      description: "Limited guest access",
      level: 1,
      isSystem: true,
      color: "#6b7280",
      icon: "user-circle",
    },
  ];
};

// Static method to create default roles
UserRoleSchema.statics.createDefaultRoles = async function () {
  const defaultRoles = this.getDefaultRoles();

  for (const roleData of defaultRoles) {
    const existingRole = await this.findOne({ name: roleData.name });
    if (!existingRole) {
      await this.create(roleData);
    }
  }
};

export default mongoose.models.UserRole ||
  mongoose.model("UserRole", UserRoleSchema);
