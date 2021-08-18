interface BaseUseCase<IRequest, IResponse> {
  execute(request?: IRequest): Promise<IResponse> | IResponse;
}

export { BaseUseCase };
