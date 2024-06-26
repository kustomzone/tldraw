import { createMigrationIds, createRecordMigrationSequence } from '@tldraw/store'
import { T } from '@tldraw/validate'
import { TLAsset } from '../records/TLAsset'
import { TLBaseAsset, createAssetValidator } from './TLBaseAsset'

/**
 * An asset used for URL bookmarks, used by the TLBookmarkShape.
 *
 *  @public */
export type TLBookmarkAsset = TLBaseAsset<
	'bookmark',
	{
		title: string
		description: string
		image: string
		src: string | null
	}
>

/** @internal */
export const bookmarkAssetValidator: T.Validator<TLBookmarkAsset> = createAssetValidator(
	'bookmark',
	T.object({
		title: T.string,
		description: T.string,
		image: T.string,
		src: T.srcUrl.nullable(),
	})
)

const Versions = createMigrationIds('com.tldraw.asset.bookmark', {
	MakeUrlsValid: 1,
} as const)

export { Versions as bookmarkAssetVersions }

/** @internal */
export const bookmarkAssetMigrations = createRecordMigrationSequence({
	sequenceId: 'com.tldraw.asset.bookmark',
	recordType: 'asset',
	filter: (asset) => (asset as TLAsset).type === 'bookmark',
	sequence: [
		{
			id: Versions.MakeUrlsValid,
			up: (asset: any) => {
				if (!T.srcUrl.isValid(asset.props.src)) {
					asset.props.src = ''
				}
			},
			down: (_asset) => {
				// noop
			},
		},
	],
})
