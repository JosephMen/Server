/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {import("express").NextFunction} next
 */
export async function MwValidateNumericId (req, res, next) {
  const id = Number.parseInt(req.params?.id)
  req.body.skip = isNaN(id)
  req.body.id = id
  return next()
}
