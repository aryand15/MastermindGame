const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
    origin: ["http://localhost:5173"]
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const AVAILABLE_COLORS = ["red", "blue", "green", "yellow", "orange", "purple", "pink", "white", "black", "cyan"];


/**
 * Generates a random sequence of colors.
 * @param {Array} colors - the list of available colors to choose from.
 * @param {number} length - the length of the sequence.
 * @returns {Array} - the random sequence, represented as an array of colors.
 */
function generateCode (colors, length) {
    const code = [];
    for (let i = 0; i < length; i++) {
        randIndex = Math.floor(Math.random() * colors.length);
        code.push(colors[randIndex]);
    }
    return code;
}

app.get("/api", (req, res) => {
    res.json({fruits: ["apple", "orange", "banana"]});
});

/**
 * GET /api/available-colors
 * Returns the list of colors available to make a code with.
 *
 * Response:
 * {
 *   "colors": <ALL AVAILABLE COLORS>
 * }
 */
app.get("/api/available-colors", (req, res) => {
    res.json({ colors: AVAILABLE_COLORS });
});

/**
 * GET /api/generate-code
 * Generates a random code with the given constraints.
 * 
 * Query Parameters:
 * - colors (optional): A comma-separated list of colors that the code will be comprised of. Default is red,blue,green,yellow,black,white.
 * - length (optional): The length of the code to generate. Default is 4.
 * 
 * Response:
 * {
 *   "code": <THE RANDOM CODE> (list),
 *   "colors": <COLORS USED TO MAKE CODE> (list),
 *   "length": <LENGTH OF FINAL CODE> (number)
 * }
 */
app.get("/api/generate-code", (req, res) => {
    const colors = req.query.colors
    ? req.query.colors.split(",").filter((color) => AVAILABLE_COLORS.includes(color))
    : ["red","blue","green","yellow","black","white"]

    const length = req.query.length ? parseInt(req.query.length) : 4;

    if (isNaN(length)) {
        return res.status(400).json({ error: "Length must be a number." });
    }

    if (length <= 0 || length > 10) {
        return res.status(400).json({ error: "Length must be between 1 and 10." });
    }

    if (colors.length < length) {
        return res.status(400).json({ error: `Choose from these colors: ${AVAILABLE_COLORS.join(", ")}. There must be at least as many colors as the length of the code.` });
    }

    const randomCode = generateCode(colors, length);
    return res.json({ code: randomCode, colors: colors, length: length });

});

app.listen(8080, () => {
    console.log("Server started on port 8080");
});