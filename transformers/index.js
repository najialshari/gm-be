const userTransformer = (user) => {
  delete user["dataValues"]["password"];
  delete user["dataValues"]["deletedAt"];
  delete user["dataValues"]["createdAt"];
  delete user["dataValues"]["updatedAt"];
  return user;
};


// const linksTransformers = (links) => {
//   links.map((link) => {
//     delete link["dataValues"]["qrlinks"];
//     delete link["dataValues"]["userId"];
//     delete link["dataValues"]["isPrivate"];
//     delete link["dataValues"]["order"];
//     delete link["dataValues"]["deletedAt"];
//     delete link["dataValues"]["createdAt"];
//     delete link["dataValues"]["updatedAt"];
//     delete link["dataValues"]["linktype"]['createdAt'];
//     delete link["dataValues"]["linktype"]['updatedAt'];
//   });
//   return links;
// };



module.exports = {
  userTransformer
};
