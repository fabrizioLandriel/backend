// import { io } from "../app.js";
// import { isValidObjectId } from "mongoose";
// import { productService } from "../services/ProductService.js";
// import { CustomError } from "../utils/CustomError.js";
// import { ERROR_TYPES } from "../utils/EErrors.js";

// export class ProductController {
//   static getProducts = async (req, res, next) => {
//     try {
//       try {
//         let { limit, sort, page, ...filters } = req.query;
//         let products = await productService.getProductsPaginate(
//           limit,
//           page,
//           sort,
//           filters
//         );
//         return res.json(products);
//       } catch (error) {
//         return CustomError.createError(
//           "Error",
//           null,
//           "Internal server Error",
//           ERROR_TYPES.INTERNAL_SERVER_ERROR
//         );
//       }
//     } catch (error) {
//       if (error.code !== 500) {
//         req.logger.error(
//           JSON.stringify(
//             {
//               name: error.name,
//               message: error.message,
//               stack: error.stack,
//               code: error.code,
//             },
//             null,
//             5
//           )
//         );
//       } else {
//         req.logger.fatal(
//           JSON.stringify(
//             {
//               name: error.name,
//               message: error.message,
//               stack: error.stack,
//               code: error.code,
//             },
//             null,
//             5
//           )
//         );
//       }
//       next(error);
//     }
//   };

//   static getProductById = async (req, res, next) => {
//     let { pid } = req.params;
//     if (!isValidObjectId(pid)) {
//       return CustomError.createError(
//         "ERROR",
//         null,
//         "Enter a valid Mongo ID",
//         ERROR_TYPES.INVALID_ARGUMENTS
//       );
//     }
//     try {
//       let product = await productService.getProductsBy({ _id: pid });
//       if (product) {
//         res.json({ product });
//       } else {
//         return CustomError.createError(
//           "Not found",
//           null,
//           "Product not found",
//           ERROR_TYPES.NOT_FOUND
//         );
//       }
//     } catch (error) {
//       if (error.code !== 500) {
//         req.logger.error(
//           JSON.stringify(
//             {
//               name: error.name,
//               message: error.message,
//               stack: error.stack,
//               code: error.code,
//             },
//             null,
//             5
//           )
//         );
//       } else {
//         req.logger.fatal(
//           JSON.stringify(
//             {
//               name: error.name,
//               message: error.message,
//               stack: error.stack,
//               code: error.code,
//             },
//             null,
//             5
//           )
//         );
//       }
//       next(error);
//     }
//   };

//   static addProduct = async (req, res, next) => {
//     try {
//       let {
//         title,
//         description,
//         code,
//         price,
//         status,
//         stock,
//         category,
//         thumbnails,
//       } = req.body;
//       if (!title || !description || !code || !price || !stock || !category)
//         return CustomError.createError(
//           "Unfilled fields",
//           null,
//           "Check unfilled fields",
//           ERROR_TYPES.INVALID_ARGUMENTS
//         );

//       let exist;
//       try {
//         exist = await productService.getProductsBy({ code });
//       } catch (error) {
//         return CustomError.createError(
//           "Error",
//           null,
//           "Internal server Error",
//           ERROR_TYPES.INTERNAL_SERVER_ERROR
//         );
//       }

//       if (exist) {
//         return CustomError.createError(
//           "Error",
//           null,
//           `Code ${code} already exist`,
//           ERROR_TYPES.INVALID_ARGUMENTS
//         );
//       }

//       try {
//         await productService.addProduct({ ...req.body });
//         let productList = await productService.getAllProducts();
//         io.emit("updateProducts", productList);
//         return res.json({ payload: `Product added` });
//       } catch (error) {
//         return CustomError.createError(
//           "Error",
//           null,
//           "Internal server Error",
//           ERROR_TYPES.INTERNAL_SERVER_ERROR
//         );
//       }
//     } catch (error) {
//       if (error.code !== 500) {
//         req.logger.error(
//           JSON.stringify(
//             {
//               name: error.name,
//               message: error.message,
//               stack: error.stack,
//               code: error.code,
//             },
//             null,
//             5
//           )
//         );
//       } else {
//         req.logger.fatal(
//           JSON.stringify(
//             {
//               name: error.name,
//               message: error.message,
//               stack: error.stack,
//               code: error.code,
//             },
//             null,
//             5
//           )
//         );
//       }
//       next(error);
//     }
//   };

//   static updateProduct = async (req, res, next) => {
//     try {
//       let { pid } = req.params;
//       if (!isValidObjectId(pid)) {
//         return CustomError.createError(
//           "ERROR",
//           null,
//           "Enter a valid Mongo ID",
//           ERROR_TYPES.INVALID_ARGUMENTS
//         );
//       }

//       let toUpdate = req.body;

//       if (toUpdate._id) {
//         delete toUpdate._id;
//       }

//       if (toUpdate.code) {
//         let exist;
//         try {
//           exist = await productService.getProductsBy({ code: toUpdate.code });
//           if (exist) {
//             return CustomError.createError(
//               "Error",
//               null,
//               `Code ${code} already exist`,
//               ERROR_TYPES.INVALID_ARGUMENTS
//             );
//           }
//         } catch (error) {
//           return CustomError.createError(
//             "ERROR",
//             null,
//             "Internal server Error",
//             ERROR_TYPES.INTERNAL_SERVER_ERROR
//           );
//         }
//       }

//       try {
//         const products = await productService.updateProduct(pid, toUpdate);
//         return res.json(products);
//       } catch (error) {
//         return CustomError.createError(
//           "ERROR",
//           null,
//           "Error updating product ",
//           ERROR_TYPES.INVALID_ARGUMENTS
//         );
//       }
//     } catch (error) {
//       if (error.code !== 500) {
//         req.logger.error(
//           JSON.stringify(
//             {
//               name: error.name,
//               message: error.message,
//               stack: error.stack,
//               code: error.code,
//             },
//             null,
//             5
//           )
//         );
//       } else {
//         req.logger.fatal(
//           JSON.stringify(
//             {
//               name: error.name,
//               message: error.message,
//               stack: error.stack,
//               code: error.code,
//             },
//             null,
//             5
//           )
//         );
//       }
//       next(error);
//     }
//   };

//   static deleteProduct = async (req, res, next) => {
//     try {
//       let { pid } = req.params;
//       if (!isValidObjectId(pid)) {
//         return CustomError.createError(
//           "ERROR",
//           null,
//           "Enter a valid Mongo ID",
//           ERROR_TYPES.INVALID_ARGUMENTS
//         );
//       }
//       try {
//         let products = await productService.deleteProduct(pid);
//         if (products.deletedCount > 0) {
//           let productList = await productService.getProductsPaginate();
//           io.emit("deleteProducts", productList);
//           return res.json({ payload: `Product ${pid} deleted` });
//         } else {
//           return CustomError.createError(
//             "ERROR",
//             null,
//             "Product not found",
//             ERROR_TYPES.NOT_FOUND
//           );
//         }
//       } catch (error) {
//         return CustomError.createError(
//           "ERROR",
//           null,
//           `Error deleting product`,
//           ERROR_TYPES.INVALID_ARGUMENTS
//         );
//       }
//     } catch (error) {
//       if (error.code !== 500) {
//         req.logger.error(
//           JSON.stringify(
//             {
//               name: error.name,
//               message: error.message,
//               stack: error.stack,
//               code: error.code,
//             },
//             null,
//             5
//           )
//         );
//       } else {
//         req.logger.fatal(
//           JSON.stringify(
//             {
//               name: error.name,
//               message: error.message,
//               stack: error.stack,
//               code: error.code,
//             },
//             null,
//             5
//           )
//         );
//       }
//       next(error);
//     }
//   };
// }

import { io } from "../app.js";
import { isValidObjectId } from "mongoose";
import { productService } from "../services/productsService.js";
import { CustomError } from "../utils/CustomError.js";
import { ERROR_TYPES } from "../utils/EErrors.js";

export class ProductController {
  static getProducts = async (req, res, next) => {
    try {
      try {
        let { limit, sort, page, ...filters } = req.query;
        let products = await productService.getProductsPaginate(
          limit,
          page,
          sort,
          filters
        );
        return res.json(products);
      } catch (error) {
        return CustomError.createError(
          "Error",
          null,
          "Internal server Error",
          ERROR_TYPES.INTERNAL_SERVER_ERROR
        );
      }
    } catch (error) {
      if (error.code !== 500) {
        req.logger.error(
          JSON.stringify(
            {
              name: error.name,
              message: error.message,
              stack: error.stack,
              code: error.code,
            },
            null,
            5
          )
        );
      } else {
        req.logger.fatal(
          JSON.stringify(
            {
              name: error.name,
              message: error.message,
              stack: error.stack,
              code: error.code,
            },
            null,
            5
          )
        );
      }
      next(error);
    }
  };

  static getProductById = async (req, res, next) => {
    let { pid } = req.params;
    if (!isValidObjectId(pid)) {
      return CustomError.createError(
        "ERROR",
        null,
        "Enter a valid Mongo ID",
        ERROR_TYPES.INVALID_ARGUMENTS
      );
    }
    try {
      let product = await productService.getProductsBy({ _id: pid });
      if (product) {
        res.json({ product });
      } else {
        return CustomError.createError(
          "Not found",
          null,
          "Product not found",
          ERROR_TYPES.NOT_FOUND
        );
      }
    } catch (error) {
      if (error.code !== 500) {
        req.logger.error(
          JSON.stringify(
            {
              name: error.name,
              message: error.message,
              stack: error.stack,
              code: error.code,
            },
            null,
            5
          )
        );
      } else {
        req.logger.fatal(
          JSON.stringify(
            {
              name: error.name,
              message: error.message,
              stack: error.stack,
              code: error.code,
            },
            null,
            5
          )
        );
      }
      next(error);
    }
  };

  static addProduct = async (req, res, next) => {
    try {
      let {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
      } = req.body;
      if (!title || !description || !code || !price || !stock || !category)
        return CustomError.createError(
          "Unfilled fields",
          null,
          "Check unfilled fields",
          ERROR_TYPES.INVALID_ARGUMENTS
        );

      let exist;
      try {
        exist = await productService.getProductsBy({ code });
      } catch (error) {
        return CustomError.createError(
          "Error",
          null,
          "Internal server Error",
          ERROR_TYPES.INTERNAL_SERVER_ERROR
        );
      }

      if (exist) {
        return CustomError.createError(
          "Error",
          null,
          `Code ${code} already exist`,
          ERROR_TYPES.INVALID_ARGUMENTS
        );
      }

      try {
        const owner = req.session.user.email;
        await productService.addProduct({ ...req.body, owner });
        let productList = await productService.getAllProducts();
        io.emit("updateProducts", productList);
        return res.json({ payload: `Product added` });
      } catch (error) {
        return CustomError.createError(
          "Error",
          null,
          "Internal server Error",
          ERROR_TYPES.INTERNAL_SERVER_ERROR
        );
      }
    } catch (error) {
      if (error.code !== 500) {
        req.logger.error(
          JSON.stringify(
            {
              name: error.name,
              message: error.message,
              stack: error.stack,
              code: error.code,
            },
            null,
            5
          )
        );
      } else {
        req.logger.fatal(
          JSON.stringify(
            {
              name: error.name,
              message: error.message,
              stack: error.stack,
              code: error.code,
            },
            null,
            5
          )
        );
      }
      next(error);
    }
  };

  static updateProduct = async (req, res, next) => {
    try {
      let { pid } = req.params;
      if (!isValidObjectId(pid)) {
        return CustomError.createError(
          "ERROR",
          null,
          "Enter a valid Mongo ID",
          ERROR_TYPES.INVALID_ARGUMENTS
        );
      }

      let toUpdate = req.body;

      if (toUpdate._id) {
        delete toUpdate._id;
      }

      if (toUpdate.code) {
        let exist;
        try {
          exist = await productService.getProductsBy({ code: toUpdate.code });
          if (exist) {
            return CustomError.createError(
              "Error",
              null,
              `Code ${code} already exist`,
              ERROR_TYPES.INVALID_ARGUMENTS
            );
          }
        } catch (error) {
          return CustomError.createError(
            "ERROR",
            null,
            "Internal server Error",
            ERROR_TYPES.INTERNAL_SERVER_ERROR
          );
        }
      }

      try {
        const products = await productService.updateProduct(pid, toUpdate);
        return res.json(products);
      } catch (error) {
        return CustomError.createError(
          "ERROR",
          null,
          "Error updating product ",
          ERROR_TYPES.INVALID_ARGUMENTS
        );
      }
    } catch (error) {
      if (error.code !== 500) {
        req.logger.error(
          JSON.stringify(
            {
              name: error.name,
              message: error.message,
              stack: error.stack,
              code: error.code,
            },
            null,
            5
          )
        );
      } else {
        req.logger.fatal(
          JSON.stringify(
            {
              name: error.name,
              message: error.message,
              stack: error.stack,
              code: error.code,
            },
            null,
            5
          )
        );
      }
      next(error);
    }
  };

  static deleteProduct = async (req, res, next) => {
    try {
      let { pid } = req.params;
      if (!isValidObjectId(pid)) {
        return CustomError.createError(
          "ERROR",
          null,
          "Enter a valid Mongo ID",
          ERROR_TYPES.INVALID_ARGUMENTS
        );
      }
      const userRole = req.session.user.role.toLowerCase();
      const userEmail = req.session.user.email;
      let product = await productService.getProductsBy({ _id: pid });

      if (
        userRole === "admin" ||
        (userRole === "premium" && product.owner === userEmail)
      ) {
        try {
          let products = await productService.deleteProduct(pid);
          if (products.deletedCount > 0) {
            let productList = await productService.getProductsPaginate();
            io.emit("deleteProducts", productList);
            return res.json({ payload: `Product ${pid} deleted` });
          } else {
            return CustomError.createError(
              "ERROR",
              null,
              "Product not found",
              ERROR_TYPES.NOT_FOUND
            );
          }
        } catch (error) {
          return CustomError.createError(
            "ERROR",
            null,
            `Error deleting product`,
            ERROR_TYPES.INVALID_ARGUMENTS
          );
        }
      } else {
        return res
          .status(403)
          .json({ error: `Insufficient privileges to delete` });
      }
    } catch (error) {
      if (error.code !== 500) {
        req.logger.error(
          JSON.stringify(
            {
              name: error.name,
              message: error.message,
              stack: error.stack,
              code: error.code,
            },
            null,
            5
          )
        );
      } else {
        req.logger.fatal(
          JSON.stringify(
            {
              name: error.name,
              message: error.message,
              stack: error.stack,
              code: error.code,
            },
            null,
            5
          )
        );
      }
      next(error);
    }
  };
}