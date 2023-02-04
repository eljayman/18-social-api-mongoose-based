module.exports = {
  // helper function
  formatDate: (date) => {
    const formatted = new Date(date);
    // format date to MM/DD/YYYY 00:00:00 AM/PM
    return `${formatted.toLocaleDateString()} ${formatted.toLocaleTimeString()}`;
  },
};
