export type WithRef<TProps extends object, TRef> = TProps & {
	ref?: React.Ref<TRef | null>;
};
