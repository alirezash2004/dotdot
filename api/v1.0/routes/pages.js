import { Router } from 'express';
import { getPage, newPage, updatePageinfo, deletePage } from '../controllers/pageController.js';
const router = Router();

router.get('/pages/getPage/:pageId', getPage);

router.post('/pages/newPage', newPage);

router.put('/pages/updatePageinfo/:pageId', updatePageinfo);

router.delete('/pages/delPage/:pageId', deletePage);



// sample -- TODO: Delete late
router.get('/asldjashjkdahsd', (req, res) => {
    res.sendStatus(201)
})



export default router;