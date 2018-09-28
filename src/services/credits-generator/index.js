const CREDIT_POS = [
    [],
    [8],
    [4, 6],
    [7, 9, 2],
    [7, 9, 1, 3],
    [7, 9, 5, 1, 3],
    [7, 9, 4, 6, 1, 3]
];

const SIZE_TITLE = 36;
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
     * @param sText {string}
     * @param nSize {number}
     * @param nPos {number}
     * @param ctx {CanvasRenderingContext2D}
     * @param x {number}
     * @param y {number}
     * @param w {number}
     * @param h {number}
     */
    drawText(sText, nSize, nPos, ctx, x, y, w, h) {
        return new Promise(async resolve => {
            ctx.fillStyle = 'white';
            let sFontDef = nSize.toString() + 'px "Wendy One"';
            await document.fonts.load(sFontDef);
            ctx.font = sFontDef;
            let m = ctx.measureText(sText);
            let r = this.computePos(nPos, w, h, m.width | 0, nSize);
            r.x += x;
            r.y += y;
            ctx.fillText(sText, r.x | 0, r.y | 0);
            resolve();
        });
    }

    async composeEndCredits(canvas, title, credits) {
        this.frame(canvas);
        let ctx = canvas.getContext('2d');
        let nCount = credits.length;
        let aPos = CREDIT_POS[nCount];
        const PADDING = canvas.width / 5 | 0;
        await this.drawText(
            title,
            SIZE_TITLE,
            5,
            ctx,
            0,
            0,
            canvas.width,
            canvas.height >> 1
        );
        for (let i = 0; i < credits.length; ++i) {
            await this.drawText(
                credits[i],
                SIZE_AUTHOR,
                aPos[i],
                ctx,
                PADDING,
                canvas.height >> 1,
                canvas.width - PADDING - PADDING,
                (canvas.height >> 1) - PADDING
            );
        }
    }

    frame(canvas) {
        let ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        let PADDING = canvas.width / 20 | 0;
        ctx.lineWidth = 2;
        ctx.strokeRect(
            PADDING,
            PADDING,
            canvas.width - PADDING - PADDING,
            canvas.height - PADDING - PADDING
        );
        PADDING = canvas.width / 16 | 0;
        ctx.lineWidth = 4;
        ctx.strokeRect(
            PADDING,
            PADDING,
            canvas.width - PADDING - PADDING,
            canvas.height - PADDING - PADDING
        );
    }

    async composeStartScreen(canvas, title) {
        let ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        this.frame(canvas);
        await this.drawText(
            title,
            SIZE_TITLE,
            5,
            ctx,
            0,
            0,
            canvas.width,
            canvas.height
        );
    }
}

module.exports = CreditsGenerator;