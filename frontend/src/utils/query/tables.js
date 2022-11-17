import { computed } from 'vue'
import { safeJSONParse } from '@/utils'

export function useQueryTables(query) {
	return {
		data: computed(() =>
			query.doc?.tables.map((table) => {
				return {
					...table,
					value: table.table,
					join: table.join ? safeJSONParse(table.join) : null,
				}
			})
		),
		validateRemoveTable({ table, label }) {
			const columnsFromTable = query.doc.columns.filter((c) => c.table === table)
			const selectedTables = query.doc.tables.reduce((acc, t) => {
				if (!acc[t.table]) acc[t.table] = 0
				acc[t.table]++

				if (t.join) {
					const join = safeJSONParse(t.join)
					if (join.with.value) {
						if (!acc[join.with.value]) acc[join.with.value] = 0
						acc[join.with.value]++
					}
				}
				return acc
			}, {})
			if (selectedTables[table] > 1) {
				return
			}
			if (columnsFromTable.length > 0) {
				return {
					title: 'Cannot remove table',
					message: `Remove dimensions and metrics associated with ${label} table and try again`,
					appearance: 'warning',
				}
			}
		},
	}
}
