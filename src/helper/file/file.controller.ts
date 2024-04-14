import {
  Controller,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { BaseResponse } from '../../abstracts/base-response';

import { SaveFileDataDto } from './dto/save-file-data.dto';
import { FileService } from './file.service';

@ApiTags('File')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}
  @Post('/local')
  @ApiOperation({ summary: 'Upload File' })
  @ApiResponse({ status: 201, description: 'Success Upload File.' })
  @ApiResponse({ status: 400, description: 'Failed Upload File.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadLocal(@Req() request, @Res() response, @UploadedFile() file) {
    const ctx = `Upload File`;
    const baseUrl = `${request.protocol}://${request.get(
      'Host',
    )}/api/v1/public`;
    const upload = await this.fileService.uploadLocal(file);
    if (!upload) {
      response
        .status(400)
        .send(new BaseResponse(null, `Failed ${ctx}.`, 400, false));
    }
    const data = new SaveFileDataDto();
    data.filename = upload.filename;
    data.extension = upload.extension;
    data.size = upload.size;
    data.url = `${baseUrl}/${upload.filename}`;
    const result = await this.fileService.saveFileData(data);
    if (!result) {
      response
        .status(400)
        .send(new BaseResponse(null, `Failed ${ctx}.`, 400, false));
    }
    response
      .status(201)
      .send(new BaseResponse(result, `Success ${ctx}.`, 201, true));
  }
}
