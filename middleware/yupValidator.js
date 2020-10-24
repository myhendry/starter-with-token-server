const Validators = (schema) => {
  return async (req, res, next) => {
    try {
      const validatedBody = await schema.validate(req.body, {
        abortEarly: false,
      });
      req.body = validatedBody;
      next();
    } catch (err) {
      const yupErrMsg = err.inner.map((e) => {
        return {
          path: e.path,
          message: e.message,
        };
      });
      res.status(400).send(yupErrMsg);
    }
  };
};

module.exports = Validators;
