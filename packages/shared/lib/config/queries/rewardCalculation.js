"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRewardCalculationQuery = void 0;
const network_1 = require("../network");
const loadPreindex_1 = require("./loadPreindex");
function addRewardCalculationQuery(builder) {
    const metadata = (0, loadPreindex_1.loadPreindexFile)(`./assets/${network_1.network.name}/router.json`);
    if (metadata) {
        for (const contract of metadata.rewardCalculation) {
            builder.addLog({
                range: {
                    from: contract.range.from,
                    to: contract.range.to ? contract.range.to : metadata.height,
                },
                where: {
                    address: [contract.address],
                    topic0: [],
                },
            });
        }
    }
    builder.addLog({
        range: {
            from: metadata ? metadata.height + 1 : network_1.network.range.from,
        },
        where: {
            topic0: [],
        },
    });
}
exports.addRewardCalculationQuery = addRewardCalculationQuery;
//# sourceMappingURL=rewardCalculation.js.map