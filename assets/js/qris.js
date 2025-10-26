/**
 * QRIS Dynamic Generator
 * 
 * This module converts static QRIS string to dynamic QRIS with amount
 * Based on EMVCo QR Code Specification
 */

const QRIS = {
    /**
     * Parse QRIS string into objects
     * @param {string} qrisString - Original QRIS string
     * @returns {Array} Array of {id, length, value}
     */
    parse(qrisString) {
        const result = [];
        let i = 0;
        
        while (i < qrisString.length) {
            const id = qrisString.substr(i, 2);
            const length = parseInt(qrisString.substr(i + 2, 2));
            const value = qrisString.substr(i + 4, length);
            
            result.push({ id, length, value });
            i += 4 + length;
        }
        
        return result;
    },

    /**
     * Build QRIS string from objects
     * @param {Array} objects - Array of {id, value}
     * @returns {string} QRIS string
     */
    build(objects) {
        let result = '';
        
        for (const obj of objects) {
            const length = obj.value.length.toString().padStart(2, '0');
            result += obj.id + length + obj.value;
        }
        
        return result;
    },

    /**
     * Calculate CRC16-CCITT
     * @param {string} data - Data to calculate CRC
     * @returns {string} 4-char hex CRC
     */
    crc16(data) {
        let crc = 0xFFFF;
        
        for (let i = 0; i < data.length; i++) {
            crc ^= data.charCodeAt(i) << 8;
            
            for (let j = 0; j < 8; j++) {
                if ((crc & 0x8000) !== 0) {
                    crc = (crc << 1) ^ 0x1021;
                } else {
                    crc = crc << 1;
                }
            }
        }
        
        crc = crc & 0xFFFF;
        return crc.toString(16).toUpperCase().padStart(4, '0');
    },

    /**
     * Generate dynamic QRIS with amount
     * @param {string} staticQRIS - Static QRIS string
     * @param {number} amount - Transaction amount
     * @returns {string} Dynamic QRIS string
     */
    generateDynamic(staticQRIS, amount) {
        // Parse static QRIS
        let qrisObjects = this.parse(staticQRIS);
        
        // Remove CRC (tag 63) if exists
        qrisObjects = qrisObjects.filter(obj => obj.id !== '63');
        
        // Update or add transaction amount (tag 54)
        const amountStr = amount.toString();
        const amountIndex = qrisObjects.findIndex(obj => obj.id === '54');
        
        if (amountIndex !== -1) {
            // Update existing amount
            qrisObjects[amountIndex].value = amountStr;
        } else {
            // Add new amount tag (insert before tag 58 or at the end)
            const tag58Index = qrisObjects.findIndex(obj => obj.id === '58');
            const insertIndex = tag58Index !== -1 ? tag58Index : qrisObjects.length;
            qrisObjects.splice(insertIndex, 0, { id: '54', value: amountStr });
        }
        
        // Build QRIS without CRC
        let qrisWithoutCRC = this.build(qrisObjects);
        
        // Add CRC placeholder
        qrisWithoutCRC += '6304';
        
        // Calculate CRC
        const crc = this.crc16(qrisWithoutCRC);
        
        // Build final QRIS
        const finalQRIS = qrisWithoutCRC + crc;
        
        return finalQRIS;
    }
};
