export const loginWithPassport = (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      message: "Login successful",
      user: {
        id: req.user._id,
        email: req.user.email,
        fullName: req.user.fullName,
        role: req.user.role,
      },
    });
  } else {
    res.status(401).json({ message: "Login failed" });
  }
};

export const logout = (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: "Logout error", error: err });
    res.json({ message: "Logged out successfully" });
  });
};

export const isLoggedIn = (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.status(401).json({ authenticated: false });
  }
};

export { loginWithPassport as loginUser };

export const registerUser = async (req, res) => {
  res.status(501).json({ message: "registerUser not implemented" });
};

export const verifyOTP = async (req, res) => {
  res.status(501).json({ message: "verifyOTP not implemented" });
};
