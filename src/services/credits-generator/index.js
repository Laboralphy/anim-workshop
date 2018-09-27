const CREDIT_POS = [
    [],
    [8],
    [4, 6],
    [7, 9, 2],
    [7, 9, 1, 3],
    [7, 9, 5, 1, 3],
    [7, 9, 4, 6, 1, 3]
];

const SIZE_TITLE = 32;
const SIZE_AUTHOR = 24;

class CreditsGenerator {
    computePos(nPos, cvsWidth, cvsHeight, itemWidth, itemHeight) {
        let left = 0;
        let top = 0;
        let right = cvsWidth - itemWidth;
        let bottom = cvsHeight - itemHeight;
        let centerx = right >> 1;
        let centery = bottom >> 1;

        switch (nPos) {
            case 7:
                return {
                    x: left,
                    y: top
                };

            case 8:
                return {
                    x: centerx,
                    y: top,
                };

            case 9:
                return {
                    x: right,
                    y: top
                };

            case 4:
                return {
                    x: left,
                    y: centery
                };

            case 5:
                return {
                    x: centerx,
                    y: centery
                };

            case 6:
                return {
                    x: right,
                    y: centery
                };

            case 1:
                return {
                    x: left,
                    y: bottom
                };

            case 2:
                return {
                    x: centerx,
                    y: bottom
                };

            case 3:
                return {
                    x: right,
                    y: bottom
                };
        }
    }

    /**
     * Affiche un texte
     * @param sText
     * @param nPos
     * @param ctx {CanvasRenderingContext2D}
     * @param x
     * @param y
     * @param w
     * @param h
     */
    drawText(sText, nSize, nPos, ctx, x, y, w, h) {
        ctx.fillStyle = 'white';
        ctx.font = nSize.toString() + 'px Wendy One';
        let m = ctx.measureText(sText);
        let r = this.computePos(nPos, w, h, m.width | 0, nSize);
        r.x += x;
        r.y += y;
        console.log(sText, r.x | 0, r.y | 0);
        ctx.fillText(sText, r.x | 0, r.y | 0);
    }

    compose(canvas, title, credits) {
        let ctx = canvas.getContext('2d');
        let nCount = credits.length;
        let aPos = CREDIT_POS[nCount];
        const PADDING = canvas.width / 20 | 0;
        this.drawText(title, SIZE_TITLE, 5, ctx, 0, 0, canvas.width, canvas.height >> 1);
        credits.forEach((c, i) => {
            let pos = aPos[i];
            this.drawText(c, SIZE_AUTHOR, pos, ctx, PADDING, canvas.height >> 1, canvas.width - PADDING - PADDING, (canvas.height >> 1) - PADDING);
        });
    }
}


module.exports = CreditsGenerator;