/*  Love Saroha
    lovesaroha1994@gmail.com (email address)
    https://www.lovesaroha.com (website)
    https://github.com/lovesaroha  (github)
*/

"use-strict";

(function ($) {
    // Random number between range.
    function Random(min, max) {
        // Checks if min or max are given.
        if (!min || typeof min != "number") {
            min = -1;
        }
        if (!max || typeof min != "number") {
            max = 1;
        }
        let randNumb = Math.random();
        if (min < 0) {
            randNumb *= (max + Math.abs(min));
        } else {
            randNumb *= (max - min);
        }
        randNumb += min;
        return randNumb;
    }

    // Sigmoid function.
    function Sigmoid(x) {
        // If x is not a number.
        if (typeof x != "number") {
            console.error("lmath.js: Input to sigmoid() is not a valid number!");
            return 0;
        }
        return 1 / (1 + Math.exp(-x));
    }
    // Differential of sigmoid.
    function Dsigmoid(y) {
        // If y is not a number.
        if (typeof y != "number") {
            console.error("lmath.js: Input to dsigmoid() is not a valid number!");
            return 0;
        }
        return y * (1 - y);
    }

    // Relu function.
    function Relu(x) {
        // If x is not a number.
        if (typeof x != "number") {
            console.error("lmath.js: Input to relu() is not a valid number!");
            return 0;
        }
        return Math.max(0, x);
    }

    // Differentiation of relu.
    function Drelu(y) {
        // If y is not a number.
        if (typeof y != "number") {
            console.error("lmath.js: Input to drelu() is not a valid number!");
            return 0;
        }
        if (y <= 0) {
            return 0;
        } else {
            return 1;
        }
    }

    // Map.
    function MapValue(n, start1, stop1, start2, stop2, withinBounds) {
        if (typeof n != "number" || typeof start1 != "number" || typeof stop1 != "number" || typeof start2 != "number" || typeof stop2 != "number") {
            // Checks if any argument is not a number.
            console.error("lmath.js: Arguments to map() must be a valid number!");
            return 1;
        }
        var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
        if (!withinBounds) {
            return newval;
        }
        if (start2 < stop2) {
            return constrain(newval, start2, stop2);
        } else {
            return constrain(newval, stop2, start2);
        }
    }

    // Constrain.
    function constrain(n, low, high) {
        return Math.max(Math.min(n, high), low);
    }

    // Matrix class.
    class MatrixObject {
        // Constructor function for new Matrix Class().
        constructor(rows, cols) {
            // Create new matrix.
            this.rows = rows;
            this.cols = cols;
            this.values = [];
        }
        // Print matrix shape.
        Shape() {
            console.log(`(${this.rows} x ${this.cols})`);
        }
        // Print matrix values.
        Print() {
            let printLog = ``;
            for (let i = 0; i < this.rows; i++) {
                printLog = printLog + ` [ `;
                for (let j = 0; j < this.cols; j++) {
                    printLog = printLog + ` ${this.values[i][j]} `;
                }
                printLog = printLog + ` ] \n`;
            }
            console.log(printLog);
        }
        // Add matrix or scaler number to a matrix.
        Add(value) {
            return elementWise(this, value, 1);
        }
        // Subtract matrix or scaler number to a matrix.
        Sub(value) {
            return elementWise(this, value, 2);
        }
        // Multiply matrix element wise.
        Mul(value) {
            return elementWise(this, value, 3);
        }
        // Multiply matrix element wise.
        Divide(value) {
            return elementWise(this, value, 4);
        }
        // Copy of a matrix.
        Copy() {
            let newMatrix = new MatrixObject(this.rows, this.cols);
            for (let i = 0; i < this.rows; i++) {
                newMatrix.values[i] = [];
                for (let j = 0; j < this.cols; j++) {
                    newMatrix.values[i][j] = this.values[i][j];
                }
            }
            return newMatrix;
        }
        // Transpose of a matrix.
        Transpose() {
            let newMatrix = new MatrixObject(this.cols, this.rows);
            for (let i = 0; i < this.cols; i++) {
                newMatrix.values[i] = [];
                for (let j = 0; j < this.rows; j++) {
                    newMatrix.values[i][j] = this.values[j][i];
                }
            }
            return newMatrix;
        }
        // Dot product scalar or matrix.
        Dot(value) {
            if (value instanceof MatrixObject == false) {
                console.error("lmath.js: Must be a matrix object!");
                return this;
            }
            // Argument is a matrix object.
            if (this.cols != value.rows) {
                console.error("lmath.js: Number of columns of first matrix must be equal to number of rows in second!");
                return;
            }
            let newMatrix = new MatrixObject(this.rows, value.cols);
            for (let i = 0; i < newMatrix.rows; i++) {
                newMatrix.values[i] = [];
                for (let j = 0; j < newMatrix.cols; j++) {
                    let sum = 0;
                    for (let r = 0; r < this.cols; r++) {
                        sum += this.values[i][r] * value.values[r][j];
                    }
                    newMatrix.values[i][j] = sum;
                }
            }
            return newMatrix;
        }
        // Sum of all values.
        Sum() {
            let sum = 0;
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    sum += this.values[i][j];
                }
            }
            return sum;
        }
        // Map function.
        Map(callback) {
            // Checks for valid callback function.
            if (callback && typeof callback != "function") {
                console.error("lmath.js: Argument to map() function must be a function!");
                return;
            }
            let newMatrix = this.Copy();
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    newMatrix.values[i][j] = callback(this.values[i][j]);
                }
            }
            return newMatrix;
        }

        // Add all column values.
        AddCols() {
            let newMatrix = new MatrixObject(this.rows, 1);
            for (let i = 0; i < this.rows; i++) {
                let sum = 0;
                for (let j = 0; j < this.cols; j++) {
                    sum += this.values[i][j];
                }
                newMatrix.values[i] = [sum];
            }
        }
    }

    // Perform addition or subtraction or multiplication element wise.
    function elementWise(matrix, value, option) {
        let newMatrix = matrix.Copy();
        if (value.constructor == Array) {
            // Convert array to matrix.
            value = ToMatrix(value);
        }
        if (value instanceof MatrixObject) {
            // Argument is a matrix.
            if (newMatrix.rows != value.rows || newMatrix.cols != value.cols) {
                console.error("lmath.js: Number of rows and columns must be same!");
                return newMatrix;
            }
            for (let i = 0; i < newMatrix.rows; i++) {
                for (let j = 0; j < newMatrix.cols; j++) {
                    if (option == 1) {
                        newMatrix.values[i][j] += value.values[i][j];
                    } else if (option == 2) {
                        newMatrix.values[i][j] -= value.values[i][j];
                    } else if (option == 3) {
                        newMatrix.values[i][j] *= value.values[i][j];
                    } else {
                        newMatrix.values[i][j] /= value.values[i][j];
                    }
                }
            }
        } else if (typeof value == "number") {
            // Argument is a number.
            for (let i = 0; i < newMatrix.rows; i++) {
                for (let j = 0; j < newMatrix.cols; j++) {
                    if (option == 1) {
                        newMatrix.values[i][j] += value;
                    } else if (option == 2) {
                        newMatrix.values[i][j] -= value;
                    } else if (option == 3) {
                        newMatrix.values[i][j] *= value;
                    } else {
                        newMatrix.values[i][j] /= value;
                    }
                }
            }
        }
        return newMatrix;
    }

    // Exported function matrix.
    function Matrix(rows, cols, minimum, maximum) {
        if (typeof rows != "number" || typeof cols != "number") {
            console.error("lmath.js: Rows and Columns to Matrix() must be a whole number!");
            return;
        }
        // Create a new matrix.
        let matrix = new MatrixObject(parseInt(rows), parseInt(cols));
        minimum = minimum || 0;
        maximum = maximum || 0;
        for (let i = 0; i < matrix.rows; i++) {
            matrix.values[i] = [];
            for (let j = 0; j < matrix.cols; j++) {
                matrix.values[i][j] = Random(minimum, maximum);
            }
        }
        return matrix;
    }

    // This function convert given value to matrix.
    function ToMatrix(values) {
        if (values.constructor == Array) {
            // Convert to matrix.
            if (values[0].constructor == Array) {
                let newMatrix = new MatrixObject(values.length, values[0].length);
                for (let i = 0; i < newMatrix.rows; i++) {
                    newMatrix.values[i] = [];
                    for (let j = 0; j < newMatrix.cols; j++) {
                        if (typeof values[i][j] != "number") {
                            console.error(`lmath.js: Array contains invalid number at ${i}${j}!`);
                            return newMatrix;
                        }
                        newMatrix.values[i][j] = values[i][j];
                    }
                }
                return newMatrix;
            } else {
                // Vector.
                let newMatrix = new MatrixObject(values.length, 1);
                for (let i = 0; i < newMatrix.rows; i++) {
                    if (typeof values[i] != "number") {
                        console.error(`lmath.js: Array contains invalid number at ${i}!`);
                        return newMatrix;
                    }
                    newMatrix.values.push([values[i]]);
                }
                return newMatrix;
            }
        }
        return new MatrixObject(0, 0);
    }


    // Exported function.
    $.lmath = {
        Random: Random,
        Sigmoid: Sigmoid,
        Dsigmoid: Dsigmoid,
        Relu: Relu,
        Drelu: Drelu,
        Map: MapValue,
        Matrix: Matrix,
        ToMatrix: ToMatrix
    };
}(window));
