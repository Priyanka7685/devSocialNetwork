import multer from 'multer'

// storage if we are working on localhost
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './public/temp')
//     },
//     filename: function (req, file, cb) {
//     //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       cb(null, file.originalname)
//     }
//   })


// storage if we are deploying our backend
const storage = multer.memoryStorage()


 const upload = multer({
    storage
})

export default upload