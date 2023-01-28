import { ref, watch, getCurrentInstance } from "vue";
export function useVmodel(props: any, key: string = "modelValue", emit?: any) {
  const vm = getCurrentInstance();
  const _emit = emit || vm?.emit;
  const event = `update:${key}`;
  const proxy = ref(props[key]);
  watch(
    () => proxy.value,
    (v) => _emit(event, v)
  );
  return proxy;
}