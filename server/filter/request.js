module.exports = (req, res) => {
  if (req.method === 'OPTIONS') {
    res.sendJSON({ msg: 'OPTIONS is ok' });
    return
  }

  req.do = true
}