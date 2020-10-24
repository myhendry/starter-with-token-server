const express = require("express");
const router = express.Router();
const passport = require("passport");
const yup = require("yup");
const yupValidator = require("../../middleware/yupValidator");

// const User = require("../../models/User");
const Todo = require("../../models/Todo");
//require("../../config/passport");

const addTodoSchema = yup.object().shape({
  name: yup.string().trim().required().min(3),
  content: yup.string().required().min(5, "must be more than 5 words la"),
});

//#region
/**
 * @swagger
 * /api/todos:
 *  get:
 *    description: Access Private - Get All Todos
 *    produces:
 *       - application/json
 *    responses:
 *      200:
 *        description: A successful response
 *      500:
 *        description: Internal Server Error
 */
//#endregion
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const todos = await Todo.find({});
      res.status(200).send(todos);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

//#region
/**
 * @swagger
 * /api/todos:
 *  post:
 *    description: Access Private - Add a Todo
 *    produces:
 *       - application/json
 *    responses:
 *      200:
 *        description: A successful response
 *      500:
 *        description: Internal Server Error
 */
//#endregion
router.post(
  "/",
  [
    passport.authenticate("jwt", { session: false }),
    yupValidator(addTodoSchema),
  ],
  async (req, res) => {
    try {
      const { name, content } = req.body;
      const t = new Todo({ name, content });
      const todo = await t.save();
      res.status(200).send(todo);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
