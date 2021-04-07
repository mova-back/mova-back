// const { adminPolicy } = require('../../../../policy');
// const { BaseAction, RequestRule } = require('../../../../root');
// const { ReportSchema } = require('../../../schemas/ReportSchema');

// class DeleteReportAction extends BaseAction {
//   static get accessTag() {
//     return 'reports:remove';
//   }

//   static get validationRules() {
//     return {
//       params: {
//         id: new RequestRule(
//           {
//             validate: {
//               validator: (v) => typeof v === 'string',
//               message: (prop) => `${prop.value} - string`,
//             },
//           },
//           { required: true }
//         ),
//       },
//     };
//   }

//   static async run(ctx) {
//     const { currentUser } = ctx;
//     adminPolicy({}, currentUser);

//     await ReportSchema.findByIdAndDelete({ _id: ctx.params.id });
//     return this.result({ message: `report by ${ctx.params.id} was removed` });
//   }
// }

// module.exports = { DeleteReportAction };
