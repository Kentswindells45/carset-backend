const ownerOnly = (req, res, next) => {
  if (req.user.role !== "owner") {
    return res
      .status(403)
      .json({ message: "Only owners can perform this action" });
  }
  next();
};
router.post("/", protect, ownerOnly, addVehicle);

module.exports = ownerOnly;
