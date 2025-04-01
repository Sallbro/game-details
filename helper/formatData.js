
const formatRequirementsApi = (data) => {
    const sysrec = {};
    // for (system in data) {
    //     for (system_type in system) {
    for (let os in data) {
        const osDetails = {};
        for (let reqtype in data[os]) {
            const parsedRequirements = data[os][reqtype]
                .map(item => {
                    const match = item.match(/^([^:]+):\s*(.+)$/);
                    if (match) {
                        let type = match[1].trim();
                        let value = match[2].trim();
                        if (type && type.toLowerCase().includes("os")) {
                            type = "os";
                        }
                        else if (type && type.toLowerCase().includes("processor")) {
                            type = "processor";
                        }
                        else if (type && type.toLowerCase().includes("Memory")) {
                            type = "memory";
                        }
                        else if (type && type.toLowerCase().includes("Graphics")) {
                            type = "graphics";
                        }
                        else if (type && type.toLowerCase().includes("Storage")) {
                            type = "storage";
                        }
                        else {
                            type = type.toLowerCase();
                        }
                        return { [type]: value };
                    }
                    return null; // Return null for unmatched or skipped items
                })
                .filter(Boolean); // Remove null values from the array
            if (parsedRequirements.length > 0) {
                let obj = {};
                parsedRequirements.map((data) => {
                    for (key in data) {
                        obj[key] = data[key]
                    }
                });
                osDetails[reqtype] = obj;
            }
        }
        sysrec[os] = osDetails;

    }

    return {
        sys_req: sysrec
    }
}

module.exports = { formatRequirementsApi }